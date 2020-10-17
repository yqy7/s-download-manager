import Vue from "vue";

declare module "*.vue" {
    export default Vue;
}

declare function showDebug(): boolean;

declare interface FileInfo {
    name?: string;
    url: string;
    type?: string;
    size?: number;
    desc?: string;
    isSelected: boolean
}
