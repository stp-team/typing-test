import { useEffect, useState } from "react";

export default function MobileWarning() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor;
            const mobileRegex =
                /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
            const isMobileDevice = mobileRegex.test(userAgent);
            const isSmallScreen = window.innerWidth < 768;
            setIsMobile(isMobileDevice || isSmallScreen);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (!isMobile) return null;

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <svg
                    style={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor">
                    <rect
                        x="2"
                        y="3"
                        width="20"
                        height="14"
                        rx="2"
                        ry="2"
                        strokeWidth="2"
                    />
                    <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
                    <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
                </svg>
                <h1 style={styles.title}>Телефоны не поддерживаются 😥</h1>
                <p style={styles.text}>
                    Замер скорости необходимо производить на компьютере.
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
    },
    content: {
        textAlign: "center" as const,
        color: "#ffffff",
        maxWidth: "400px",
    },
    icon: {
        width: "64px",
        height: "64px",
        margin: "0 auto 20px",
        opacity: 0.8,
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold" as const,
        marginBottom: "16px",
    },
    text: {
        fontSize: "16px",
        lineHeight: "1.5",
        opacity: 0.8,
    },
};
