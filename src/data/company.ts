export interface Company {
  name: string;
  url: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  contentVerified: boolean;
}

export const company: Company = {
  name: 'ZassTech',
  url: 'https://zasstech.com',
  email: 'rtwebcoder@gmail.com',
  phone: '03127449832',
  address: 'Pabbi, Nowshera, Pakistan',
  contentVerified: true,
};

export const reviewNotice =
  'Website preview — legal documents require owner and legal review before launch.';
