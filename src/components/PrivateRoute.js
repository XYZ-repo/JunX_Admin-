"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import useAppInit from "../../redux/hooks/useInit";

const PrivateRoute = ({ children, requiredLevel = null }) => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const { loading, initialized } = useAppInit();
  const [isChecking, setIsChecking] = useState(true);

  const publicPages = ["/signIn", "/verify-otp", "/new-password"];
  const isPublicPage = publicPages.includes(pathname);

  useEffect(() => {
    if (initialized && !loading) {
      setIsChecking(false);
    }
  }, [initialized, loading]);

  useEffect(() => {
    if (!isChecking) {
      if (!isLoggedIn && !isPublicPage) {
        router.push("/signIn");
        return;
      }

      if (isLoggedIn && isPublicPage) {
        router.push("/admin");
        return;
      }

      if (isLoggedIn && requiredLevel && user?.adminLevel) {
        const levels = {
          employee: 0,
          level_two: 1,
          level_one: 2,
          admin: 3,
        };

        const userLevel = levels[user.adminLevel] || 0;
        const required = levels[requiredLevel] || 0;

        if (userLevel < required) {
          toast.error("Insufficient permissions");
          router.push("/admin");
        }
      }
    }
  }, [user, isLoggedIn, isChecking, isPublicPage, router, requiredLevel]);

  if (isChecking || loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
      </div>
    );
  }

  if (isPublicPage) {
    return <>{children}</>;
  }

  return isLoggedIn ? <>{children}</> : null;
};

export default PrivateRoute;
