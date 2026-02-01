import { ExampleSchema } from "@modules/example/example.entity";
import { createSecureDetail, Security } from "@shared/openapi/openapi.security";
import { createApiResponseArraySchema } from "@shared/response/response.schema";

export const exampleDocs = {
    getAll: {
        detail: createSecureDetail(
            "Delete quota definition",
            "Delete quota definition",
            Security.role("admin"),
            "deleteQuotaDefinition",
        ),
        response: createApiResponseArraySchema(ExampleSchema),
    },
};
