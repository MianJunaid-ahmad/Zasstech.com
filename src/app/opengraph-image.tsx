import { ImageResponse } from 'next/og';
export const alt = 'ZassTech — digital products with a human pulse';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function SocialImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 80,
        color: 'white',
        background: 'linear-gradient(120deg, #14132c, #271549 60%, #145564)',
      }}
    >
      <div style={{ display: 'flex', fontSize: 32, color: '#d9f45b', marginBottom: 40 }}>
        ZassTech
      </div>
      <div style={{ display: 'flex', fontSize: 76, letterSpacing: -3, fontWeight: 700 }}>
        Digital products with
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: 76,
          letterSpacing: -3,
          fontWeight: 700,
          color: '#9de7e5',
        }}
      >
        a human pulse.
      </div>
      <div style={{ display: 'flex', marginTop: 45, fontSize: 23, color: '#d0cee1' }}>
        Food · Healthcare · Commerce
      </div>
    </div>,
    size,
  );
}
