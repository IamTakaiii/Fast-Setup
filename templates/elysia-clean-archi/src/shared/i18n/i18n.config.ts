import i18next from "i18next";

i18next.init({
    lng: "en", // default language
    fallbackLng: "en",
    resources: {
        en: {
            translation: {
                success: "Operation successful",
                errors: {
                    bad_request: "Bad request",
                    unauthorized: "Unauthorized",
                    forbidden: "Forbidden",
                    not_found: "Resource not found",
                    conflict: "Resource already exists",
                    validation: "Validation error",
                    too_many_requests: "Too many requests",
                    internal: "Internal server error",
                    not_implemented: "Not implemented",
                    service_unavailable: "Service unavailable",
                },
            },
        },
        th: {
            translation: {
                success: "ดำเนินการสำเร็จ",
                errors: {
                    bad_request: "คำขอไม่ถูกต้อง",
                    unauthorized: "ไม่ได้รับอนุญาต",
                    forbidden: "ไม่มีสิทธิ์เข้าถึง",
                    not_found: "ไม่พบข้อมูล",
                    conflict: "ข้อมูลซ้ำ",
                    validation: "ข้อมูลไม่ถูกต้อง",
                    too_many_requests: "คำขอมากเกินไป",
                    internal: "ข้อผิดพลาดภายในเซิร์ฟเวอร์",
                    not_implemented: "ยังไม่รองรับ",
                    service_unavailable: "บริการไม่พร้อมใช้งาน",
                },
            },
        },
    },
});

export { i18next };
