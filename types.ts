export interface RsvpData {
  id?: string;
  nama: string;
  group: string;
  phone: string;
  attendance: string;
  ucapan: string;
  createdAt: any; // Firestore Timestamp
}

export interface DataConfig {
  candidateName: string;
  university: string;
  prodi: string;
  dissertation: string;
  date: string;
  time: string;
  location: string;
  address: string;
  logoUrl: string;
  googleMapUrl: string;
  promoters: Array<{ title: string; name: string }>;
  reviewers: string[];
}