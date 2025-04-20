import React from "react";
import Image from "next/image";
import LoginCard from "@/components/login/login-card";
const Login = () => {
  return (
    <>
      <div className="min-h-screen relative">
        {/* background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://static.canva.com/web/images/543d7829999d351b301ced5ed3c1f087.jpg)",
          }}
        />
        {/* overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4), rgba(0,0,0,0.8))",
          }}
        />
        {/* logo */}
        <div className="absolute top-4 left-4 z-10">
          <Image
            src="https://static.canva.com/web/images/856bac30504ecac8dbd38dbee61de1f1.svg"
            alt="canva"
            width={90}
            height={30}
            priority
          />
        </div>
        {/* login form */}
        <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
          <LoginCard />
        </div>
      </div>
    </>
  );
};

export default Login;
