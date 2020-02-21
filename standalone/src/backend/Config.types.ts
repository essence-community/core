export interface IInstallConfig {
    appLocation?: string;
    appPort?: string;
    isUpdate?: boolean;
    dbConnectString?: string;
    dbUsername?: string;
    dbPassword?: string;
    dbPrefixAuth?: string;
    dbPrefixMeta?: string;
    wwwLocation?: string;
}
