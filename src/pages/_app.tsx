import { type AppType } from "next/dist/shared/lib/utils";
import { Poppins, Lora } from "next/font/google";

// import "~/styles/globals.css";
import "~/styles/application.scss";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
  variable: "--poppins",
});
const lora = Lora({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--lora",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={[poppins.className, lora.className].join(" ")}>
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
