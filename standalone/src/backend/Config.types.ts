export interface IInstallConfig {
    isInstallApp?: boolean;
    appLocation?: string;
    appPort?: string;
    isUpdate?: boolean;
    dbConnectString?: string;
    dbUsername?: string;
    dbPassword?: string;
    dbPrefixAuth?: string;
    dbPrefixMeta?: string;
    isInstallWww?: boolean;
    wwwLocation?: string;
}
