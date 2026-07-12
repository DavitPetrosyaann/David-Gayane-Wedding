require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

// Allow cross-origin requests from the configured frontend origin(s).
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(bodyParser.json());

const PORT = process.env.SERVER_PORT || 5200;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8718024545:AAELfIv8wn-F0DZsRvi7dIafb8RWzKl6UI0";
const RSVP_PROJECT_ID = process.env.RSVP_PROJECT_ID || "david-gayane-wedding";
const FIRESTORE_RSVP_COLLECTION =
  process.env.FIRESTORE_RSVP_COLLECTION || "projects";
let telegramBot = null;
let firestoreDb = null;

const DEFAULT_TELEGRAM_TARGET_LINK = "https://t.me/c/3760415846/105";
const TELEGRAM_TARGET_LINK =
  process.env.TELEGRAM_TARGET_LINK || DEFAULT_TELEGRAM_TARGET_LINK;

const BOT_STORAGE_DIR = path.join(__dirname, "data");
const REPORTS_DIR = path.join(__dirname, "reports");
const SENT_RSVP_LOG_FILE = path.join(
  BOT_STORAGE_DIR,
  "telegram-sent-rsvp.json",
);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJsonArray(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

function parseTelegramTargetFromLink(link) {
  try {
    const url = new URL(link);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length >= 3 && parts[0] === "c") {
      const rawChat = parts[1];
      const maybeThreadId = Number.parseInt(parts[2], 10);
      const maybeMessageId = Number.parseInt(parts[3], 10);
      const chatId = `-100${rawChat}`;
      return {
        chatId,
        messageThreadId: Number.isFinite(maybeMessageId)
          ? maybeThreadId
          : Number.isFinite(maybeThreadId)
            ? maybeThreadId
            : null,
        replyToMessageId: Number.isFinite(maybeMessageId)
          ? maybeMessageId
          : Number.isFinite(maybeThreadId)
            ? maybeThreadId
            : null,
      };
    }
  } catch {
    // noop
  }
  return { chatId: null, messageThreadId: null, replyToMessageId: null };
}

const linkTarget = parseTelegramTargetFromLink(TELEGRAM_TARGET_LINK);
const TELEGRAM_ADMIN_CHAT_ID =
  process.env.TELEGRAM_ADMIN_CHAT_ID || linkTarget.chatId;
const TELEGRAM_MESSAGE_THREAD_ID = process.env.TELEGRAM_MESSAGE_THREAD_ID
  ? Number.parseInt(process.env.TELEGRAM_MESSAGE_THREAD_ID, 10)
  : linkTarget.messageThreadId;

function getFirebaseServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }
  if (process.env.FIREBASE_SERVICE_ACCOUNT_FILE) {
    return require(process.env.FIREBASE_SERVICE_ACCOUNT_FILE);
  }
  return null;
}

function getFirestoreDb() {
  if (firestoreDb) return firestoreDb;

  const admin = require("firebase-admin");

  if (!admin.apps.length) {
    const serviceAccount = getFirebaseServiceAccount();
    const options = {};

    if (serviceAccount) {
      options.credential = admin.credential.cert(serviceAccount);
    } else {
      options.credential = admin.credential.applicationDefault();
    }

    if (process.env.FIREBASE_PROJECT_ID) {
      options.projectId = process.env.FIREBASE_PROJECT_ID;
    }

    admin.initializeApp(options);
  }

  firestoreDb = admin.firestore();
  return firestoreDb;
}

function normalizeRsvpPayload(rawData = {}) {
  return {
    name: rawData.name || "",
    attendance: rawData.attendance || "",
    guests: rawData.guests || "",
    side: rawData.side || "",
    wishes: rawData.wishes || "",
    timestamp: rawData.timestamp || new Date().toISOString(),
    telegram_id: rawData.telegram_id || null,
  };
}

async function saveRsvpToFirestore(data) {
  const admin = require("firebase-admin");
  const db = getFirestoreDb();
  const createdAtIso = new Date().toISOString();

  const docRef = await db
    .collection(FIRESTORE_RSVP_COLLECTION)
    .doc(RSVP_PROJECT_ID)
    .collection("rsvps")
    .add({
      ...data,
      createdAtIso,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

  return { id: docRef.id, createdAtIso };
}

async function readRsvpsFromFirestore(limit = 2000) {
  const db = getFirestoreDb();
  const snapshot = await db
    .collection(FIRESTORE_RSVP_COLLECTION)
    .doc(RSVP_PROJECT_ID)
    .collection("rsvps")
    .orderBy("createdAtIso", "asc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

function translateAttendance(val) {
  if (val === "yes") return "Սիրով կգամ";
  if (val === "no") return "Չեմ կարող";
  return val || "նշված չէ";
}

function translateSide(val) {
  if (val === "bride") return "Հարսի";
  if (val === "groom") return "Փեսայի";
  return val || "նշված չէ";
}

function formatRsvpSummary(data) {
  return [
    "Նոր RSVP",
    `Անուն: ${data.name || ""}`,
    `Մասնակցություն: ${translateAttendance(data.attendance)}`,
    `Հյուրեր: ${data.guests || ""}`,
    `Պատկանում է: ${translateSide(data.side)}`,
    `Մաղթանքներ: ${data.wishes || ""}`,
    `Ժամանակ: ${data.timestamp || new Date().toISOString()}`,
  ].join("\n");
}

async function sendTelegramMessage(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
    throw new Error("Telegram bot token or target chat is not configured");
  }

  const sendOptions = {};
  const isGroup = typeof TELEGRAM_ADMIN_CHAT_ID === "string"
    ? TELEGRAM_ADMIN_CHAT_ID.startsWith("-")
    : (Number.isFinite(TELEGRAM_ADMIN_CHAT_ID) && TELEGRAM_ADMIN_CHAT_ID < 0);

  if (isGroup && Number.isFinite(TELEGRAM_MESSAGE_THREAD_ID)) {
    sendOptions.message_thread_id = TELEGRAM_MESSAGE_THREAD_ID;
  }

  if (!telegramBot) {
    const TelegramBot = require("node-telegram-bot-api");
    const tempBot = new TelegramBot(TELEGRAM_BOT_TOKEN);
    return tempBot.sendMessage(TELEGRAM_ADMIN_CHAT_ID, text, sendOptions);
  }

  return telegramBot.sendMessage(TELEGRAM_ADMIN_CHAT_ID, text, sendOptions);
}

function getTelegramBotClient() {
  if (telegramBot) return telegramBot;
  if (!TELEGRAM_BOT_TOKEN) return null;
  const TelegramBot = require("node-telegram-bot-api");
  return new TelegramBot(TELEGRAM_BOT_TOKEN);
}

function logTelegramError(context, err, extra = {}) {
  const responseBody = err?.response?.body;
  const responseStatus = err?.response?.statusCode;
  console.error(`[telegram:${context}]`, {
    ...extra,
    message: err?.message || String(err),
    code: err?.code || null,
    responseStatus: responseStatus || null,
    responseBody: responseBody || null,
  });
}

async function sendGuestListMarkdownFile({
  targetChatId,
  targetThreadId,
  sourceLabelHint = "firestore",
}) {
  let reportData = [];
  let sourceLabel = sourceLabelHint;

  try {
    reportData = await readRsvpsFromFirestore();
    sourceLabel = "firestore";
  } catch (err) {
    sourceLabel = "local-log-fallback";
    reportData = readJsonArray(SENT_RSVP_LOG_FILE);
    console.warn("Firestore summary fallback:", err?.message || err);
  }

  const report = generateSummaryMarkdownFile(reportData, sourceLabel);
  const docOptions = {
    caption: `Guest list summary (.md)\nSource: ${sourceLabel}\nTotal RSVP records: ${report.total}`,
  };
  if (Number.isFinite(targetThreadId)) {
    docOptions.message_thread_id = targetThreadId;
  }

  const bot = getTelegramBotClient();
  if (!bot) {
    throw new Error("Telegram bot token is not configured");
  }

  await bot.sendDocument(targetChatId, report.fullPath, docOptions);
  return { reportData, report, sourceLabel };
}

function logSentRsvpMessage(data, telegramResponse) {
  const logs = readJsonArray(SENT_RSVP_LOG_FILE);
  logs.push({
    logged_at: new Date().toISOString(),
    payload: {
      name: data.name || "",
      attendance: data.attendance || "",
      guests: data.guests || "",
      side: data.side || "",
      wishes: data.wishes || "",
      timestamp: data.timestamp || "",
    },
    telegram: {
      chat_id: telegramResponse?.chat?.id || TELEGRAM_ADMIN_CHAT_ID,
      message_id: telegramResponse?.message_id || null,
      date: telegramResponse?.date || null,
    },
  });

  writeJson(SENT_RSVP_LOG_FILE, logs);
}

function extractSummaryRecord(item) {
  const payload = item?.payload || item || {};
  return {
    name: payload.name || "",
    attendance: translateAttendance(payload.attendance),
    guests: payload.guests || "",
    side: translateSide(payload.side),
    wishes: payload.wishes || "",
    loggedAt: item?.logged_at || item?.createdAtIso || payload.timestamp || "",
  };
}

function buildSummaryMarkdown(records, sourceLabel = "firestore") {
  const safeRecords = (Array.isArray(records) ? records : []).map(
    extractSummaryRecord,
  );
  const total = safeRecords.length;

  const attendanceCounts = safeRecords.reduce((acc, item) => {
    const key = (item?.attendance || "նշված չէ").trim() || "նշված չէ";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const sideCounts = safeRecords.reduce((acc, item) => {
    if (item?.attendance !== "Սիրով կգամ") return acc;

    const key = (item?.side || "").trim();
    if (key === "Հարսի" || key === "Փեսայի") {
      const rawGuests = String(item?.guests || "").trim();
      const parsedGuests = Number.parseInt(rawGuests, 10);
      const guestCount = Number.isFinite(parsedGuests) ? parsedGuests : 0;
      acc[key] = (acc[key] || 0) + guestCount;
    }
    return acc;
  }, { "Հարսի": 0, "Փեսայի": 0 });

  const totalGuests = safeRecords.reduce((sum, item) => {
    if (item?.attendance !== "Սիրով կգամ") return sum;

    const raw = String(item?.guests || "").trim();
    const parsed = Number.parseInt(raw, 10);
    return sum + (Number.isFinite(parsed) ? parsed : 0);
  }, 0);

  const boyGuests = sideCounts["Փեսայի"] || 0;
  const girlGuests = sideCounts["Հարսի"] || 0;
  const sumGuests = boyGuests + girlGuests;

  const header = [
    "# Telegram RSVP Summary",
    "",
    `- Generated at: ${new Date().toISOString()}`,
    `- Data source: ${sourceLabel}`,
    `- Total RSVP records: ${total}`,
    `- Total guests declared: ${totalGuests}`,
    `- All guests (boy guests + girl guests): ${boyGuests} (boy) + ${girlGuests} (girl) = ${sumGuests}`,
    "",
    "## Attendance Breakdown",
  ];

  const attendanceLines = Object.keys(attendanceCounts).length
    ? Object.entries(attendanceCounts).map(
      ([key, count]) => `- ${key}: ${count}`,
    )
    : ["- No data"];

  const sideLinesHeader = ["", "## Side Breakdown"];
  const sideLines = Object.keys(sideCounts).length
    ? Object.entries(sideCounts).map(([key, count]) => `- ${key}: ${count}`)
    : ["- No data"];

  const tableHeader = [
    "",
    "## RSVP Messages",
    "",
    "| # | Name | Attendance | Guests | Side | Wishes | Logged At |",
    "|---|---|---|---:|---|---|---|",
  ];

  const tableRows = safeRecords.map((p, index) => {
    const row = [
      String(index + 1),
      String(p.name || "").replace(/\|/g, "\\|"),
      String(p.attendance || "").replace(/\|/g, "\\|"),
      String(p.guests !== undefined && p.guests !== null ? p.guests : "").replace(/\|/g, "\\|"),
      String(p.side || "").replace(/\|/g, "\\|"),
      String(p.wishes || "").replace(/\|/g, "\\|"),
      String(p.loggedAt || "").replace(/\|/g, "\\|"),
    ];
    return `| ${row.join(" | ")} |`;
  });

  return [
    ...header,
    ...attendanceLines,
    ...sideLinesHeader,
    ...sideLines,
    ...tableHeader,
    ...(tableRows.length
      ? tableRows
      : ["| 1 | No records | - | - | - | - | - |"]),
    "",
  ].join("\n");
}

function generateSummaryMarkdownFile(records, sourceLabel) {
  const markdown = buildSummaryMarkdown(records, sourceLabel);
  ensureDir(REPORTS_DIR);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `telegram-rsvp-summary-${timestamp}.md`;
  const fullPath = path.join(REPORTS_DIR, fileName);
  fs.writeFileSync(fullPath, markdown, "utf8");
  return {
    fullPath,
    markdown,
    total: Array.isArray(records) ? records.length : 0,
  };
}

app.post("/api/rsvp", async (req, res) => {
  try {
    const data = normalizeRsvpPayload(req.body || {});
    // Primary persistence target: Firestore in main Firebase project.
    let saved = null;
    try {
      saved = await saveRsvpToFirestore(data);
    } catch (err) {
      // Firestore may be unavailable in local/dev environments. Log and continue.
      console.warn(
        "saveRsvpToFirestore failed, falling back to local log:",
        err?.message || err,
      );
      saved = null;
    }

    // Keep local log for operational fallback reports.
    try {
      logSentRsvpMessage(data, {
        chat: { id: TELEGRAM_ADMIN_CHAT_ID || null },
        message_id: null,
        date: null,
      });
    } catch (err) {
      // Logging issues should not fail RSVP submission.
      console.warn("local rsvp log write failed:", err?.message || err);
    }

    // Optional Telegram notification after successful write attempt (firestore optional).
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_ADMIN_CHAT_ID) {
      try {
        const summary = formatRsvpSummary(data);
        const telegramResponse = await sendTelegramMessage(summary);
        logSentRsvpMessage(data, telegramResponse);

        const isGroup = typeof TELEGRAM_ADMIN_CHAT_ID === "string"
          ? TELEGRAM_ADMIN_CHAT_ID.startsWith("-")
          : (Number.isFinite(TELEGRAM_ADMIN_CHAT_ID) && TELEGRAM_ADMIN_CHAT_ID < 0);

        // Send updated markdown guest list after each RSVP submission.
        await sendGuestListMarkdownFile({
          targetChatId: TELEGRAM_ADMIN_CHAT_ID,
          targetThreadId: isGroup ? TELEGRAM_MESSAGE_THREAD_ID : null,
        });
      } catch (err) {
        console.error("telegram notify error", err?.message || err);
      }
    }

    res.json({
      status: "ok",
      via: saved ? "firestore" : "local-log",
      documentId: saved ? saved.id : null,
    });
  } catch (err) {
    console.error("rsvp persist error", err?.message || err);
    res
      .status(500)
      .json({ status: "error", message: err.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`RSVP server listening on port ${PORT}`);
});

// Telegram bot (polling) commands.
if (TELEGRAM_BOT_TOKEN) {
  try {
    const TelegramBot = require("node-telegram-bot-api");
    telegramBot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

    // Helpful runtime info (don't print the token itself)
    console.log(
      "Telegram bot init: hasToken=",
      !!TELEGRAM_BOT_TOKEN,
      "adminChat=",
      TELEGRAM_ADMIN_CHAT_ID,
      "threadId=",
      TELEGRAM_MESSAGE_THREAD_ID,
    );

    telegramBot.on("polling_error", (err) => {
      logTelegramError("polling_error", err);
    });

    telegramBot.on("webhook_error", (err) => {
      logTelegramError("webhook_error", err);
    });

    // Log incoming messages to aid debugging of commands
    telegramBot.on("message", (msg) => {
      try {
        const info = {
          chatId: msg?.chat?.id,
          from:
            msg?.from?.username ||
            `${msg?.from?.first_name || ""} ${msg?.from?.last_name || ""}`.trim(),
          text: (msg?.text || "").substring(0, 200),
          message_thread_id: msg?.message_thread_id || null,
        };
        console.debug("telegram incoming message", info);
      } catch (e) {
        console.debug("telegram incoming message parse error", e?.message || e);
      }
    });

    telegramBot.onText(/^\/start(?:@\w+)?(?:\s+.*)?$/i, async (msg) => {
      const chatId = msg.chat.id;
      console.log("telegram /start received", {
        chatId,
        threadId: msg?.message_thread_id || null,
        fromId: msg?.from?.id || null,
      });

      try {
        const targetChatId = chatId;
        const threadIdFromCommand = msg.message_thread_id;
        const targetThreadId = msg.chat.type === "private"
          ? null
          : (Number.isFinite(threadIdFromCommand)
              ? threadIdFromCommand
              : TELEGRAM_MESSAGE_THREAD_ID);

        await sendGuestListMarkdownFile({
          targetChatId,
          targetThreadId,
        });
      } catch (err) {
        logTelegramError("start_command_summary", err, {
          chatId,
          threadId: msg?.message_thread_id || null,
          configuredThreadId: TELEGRAM_MESSAGE_THREAD_ID,
        });
        try {
          await telegramBot.sendMessage(
            chatId,
            `Failed to send guest-list markdown file.\n${err?.message || String(err)}`,
          );
        } catch (e) {
          logTelegramError("start_command_notify_failure", e, {
            chatId,
          });
        }
      }
    });
 
    telegramBot.onText(/^\/rsvp(?:@\w+)?$/i, async (msg) => {
      const chatId = msg.chat.id;
      console.log("telegram /rsvp summary command received", {
        chatId,
        threadId: msg?.message_thread_id || null,
        fromId: msg?.from?.id || null,
      });

      try {
        const targetChatId = chatId;
        const threadIdFromCommand = msg.message_thread_id;
        const targetThreadId = msg.chat.type === "private"
          ? null
          : (Number.isFinite(threadIdFromCommand)
              ? threadIdFromCommand
              : TELEGRAM_MESSAGE_THREAD_ID);

        await sendGuestListMarkdownFile({
          targetChatId,
          targetThreadId,
        });
      } catch (err) {
        logTelegramError("rsvp_summary_command", err, {
          chatId,
          threadId: msg?.message_thread_id || null,
        });
        try {
          await telegramBot.sendMessage(
            chatId,
            `Failed to send guest-list markdown file.\n${err?.message || String(err)}`,
          );
        } catch (e) {
          logTelegramError("rsvp_summary_notify_failure", e, {
            chatId,
          });
        }
      }
    });

    telegramBot.onText(/\/rsvp (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const text = match[1] || "";
      const parts = text.split(";").map((s) => s.trim());
      const [name, attendance, guests, side, wishes] = parts;

      const payload = {
        name:
          name ||
          `${msg.from.first_name || ""} ${msg.from.last_name || ""}`.trim(),
        attendance: attendance || "",
        guests: guests || "",
        side: side || "",
        wishes: wishes || "",
        telegram_id: msg.from.id,
      };

      try {
        const url = `http://localhost:${PORT}/api/rsvp`;
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (resp.ok) {
          await telegramBot.sendMessage(
            chatId,
            "Ձեր RSVP-ն գրանցված է, շնորհակալություն։",
          );
        } else {
          await telegramBot.sendMessage(
            chatId,
            "Պատահեց սխալ՝ չենք կարող գրանցել RSVP։",
          );
        }
      } catch (err) {
        logTelegramError("rsvp_command_api", err, { chatId });
        await telegramBot.sendMessage(
          chatId,
          "Սխալի տեղի ունեցավ, փորձեք ուշ գուցե։",
        );
      }
    });

    telegramBot.on("message", () => {
      // ignore non-command messages
    });

    console.log("Telegram bot started (polling)");
  } catch (err) {
    console.warn("Failed to start Telegram bot:", err?.message || err);
  }
}
