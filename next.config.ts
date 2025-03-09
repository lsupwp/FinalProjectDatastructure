import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false, // ปิดการแสดง build activity
    autoPrerender: false, // ลบการใช้งาน auto prerender (ถ้าอยากปิด)
  },
};

export default nextConfig;
