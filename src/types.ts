export interface RSVPFormData {
  name: string;
  attendance: 'yes' | 'no' | '';
  guests: number | '';
  side: 'bride' | 'groom' | '';
  wishes: string;
}

declare module 'canvas-confetti';