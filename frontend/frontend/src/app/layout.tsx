import "./globals.css";
import { BrainProvider } from "@/components/Brain/BrainContext";

export default function RootLayout({

    children,

}:{

    children: React.ReactNode;

}) {

    return (

        <html lang="en">

            <body>

                <BrainProvider>

                    {children}

                </BrainProvider>

            </body>

        </html>

    );

}