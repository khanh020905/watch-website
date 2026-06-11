export interface WatchModel {
  id: string;
  tag: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // in VND
  image: string;
  caseSize: string;
  waterResist: string;
  reservePower: string;
  bracketMaterial: string;
  movementType: string;
  highlights: string[];
}

export interface CustomizationState {
  strapType: 'leather' | 'steel' | 'mesh' | 'matte';
  engravingText: string;
  giftWrapping: boolean;
  warrantyExtension: boolean;
}

export interface ClientReservation {
  id: string;
  watchId: string;
  watchName: string;
  price: number;
  customization: CustomizationState;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryMethod: 'pickup' | 'delivery';
  boutiqueLocation?: string;
  shippingAddress?: string;
  createdTime: string;
}

export interface BoutiqueLocation {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
}
