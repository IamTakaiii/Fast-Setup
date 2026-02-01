const internalTags = new Set<string>();

export const openApiRegistry = {
    registerInternalTag(tag: string) {
        internalTags.add(tag);
    },


    registerInternalTags(tags: string[]) {
        tags.forEach((tag) => internalTags.add(tag));
    },


    getInternalTags(): string[] {
        return Array.from(internalTags);
    },

    isInternalTag(tag: string): boolean {
        return internalTags.has(tag);
    },
};
