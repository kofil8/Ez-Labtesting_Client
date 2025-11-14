"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.6/lottie.min.js";
    script.onload = () => {
      // @ts-ignore
      lottie.loadAnimation({
        container: document.querySelector(".lottie-animation"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "https://lottie.host/d987597c-7676-4424-8817-7fca6dc1a33e/BVrFXsaeui.json",
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className='error-container'>
      <div className='lottie-animation'></div>

      <div className='error-content'>
        <h1>404</h1>
        <p>Oops! Page is not found</p>

        <Link href='/' className='btn-home'>
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}
