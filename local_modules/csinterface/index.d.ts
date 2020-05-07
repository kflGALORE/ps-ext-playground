export module csinterface {
}

declare interface EvalScriptCallback {
    (result: string): void;
}

declare class CSInterface {
    getHostEnvironment(): HostEnvironment;
    closeExtension(): void;
    getSystemPath(pathType: SystemPath): string;
    evalScript(script: string, callback?: EvalScriptCallback): void
    getApplicationID(): string;
    getHostCapabilities(): HostCapabilities;
    dispatchEvent(event: CSEvent): void
    addEventListener(type: string, listener: Function, obj?: any): void
    requestOpenExtension(extensionId: string, params: string): void
    getExtensions(extensionIds?: string[]): Extension[]
    getNetworkPreferences(): any
    initResourceBundle(): any
    dumpInstallationInfo(): string
    getOSInformation(): string
    openURLInDefaultBrowser(url: string): string
    getExtensionID(): string
    getScaleFactor(): number
    setScaleFactorChangedHandler(handler: Function): void
    getCurrentApiVersion(): ApiVersion
    setPanelFlyoutMenu(menuXml: string): void
    updatePanelMenuItem(menuItemLabel: string, enabled: boolean, checked: boolean): boolean
    setContextMenu(menuXml: string, callback: Function): void
    setContextMenuByJSON(muenuJson: string, callback: Function): void
    updateContextMenuItem(menuItemID: string, enabled: boolean, checked: boolean): void
    isWindowVisible(): boolean
    resizeContent(width: number, height: number): void
    registerInvalidCertificateCallback(callback: Function): void
    registerKeyEventsInterest(keyEventsInterestJson: string): void
    setWindowTitle(title: string): void
    getWindowTitle(): string
}

declare const EvalScript_ErrMessage = "EvalScript error.";

declare enum CSXSWindowType {
    _PANEL = "Panel",
    _MODELESS = "Modeless",
    _MODAL_DIALOG = "ModalDialog"
}

declare enum ColorType {
    RGB = "rgb",
    GRADIENT = "gradient",
    NONE = "none"
}

declare enum SystemPath {
    USER_DATA = "userData",
    COMMON_FILES = "commonFiles",
    MY_DOCUMENTS = "myDocuments",
    APPLICATION = "application",
    EXTENSION = "extension",
    HOST_APPLICATION = "hostApplication"
}

declare interface Version {
    major: number;
    minor: number;
    micro: number;
    special: string;
}

declare interface VersionBound {
    version: Version
    inclusive: boolean;
}

declare interface VersionRange {
    lowerBound: VersionBound;
    upperBound: VersionBound | null;
}

declare interface Runtime {
    name: string;
    versionRange: VersionRange;
}

declare interface Extension {
    id: string;
    name: string;
    mainPath: string;
    basePath: string;
    windowType: string;
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    defaultExtensionDataXml: string | null;
    specialExtensionDataXml: string | null;
    requiredRuntimeList: Runtime[];
    isAutoVisible: boolean;
    isPluginExtension: boolean;
}

declare interface CSEvent {
    type: string;
    scope: 'GLOBAL' | 'APPLICATION';
    appId: string;
    extensionId: string;
    data?: any
}

declare interface RGBColor {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}

declare interface Direction {
    x: number;
    y: number;
}

declare interface GradientStop {
    offset: number;
    rgbColor: RGBColor
}

declare interface GradientColor {
    type: string;
    direction: Direction;
    numStops: number;
    arrGradientStop: GradientStop[];
}

declare interface UIColor {
    type: number;
    antialiasLevel: number;
    color: RGBColor | GradientColor;
}

declare interface AppSkinInfo {
    baseFontFamily: any;
    baseFontSize: any;
    appBarBackgroundColor: any;
    panelBackgroundColor: any;
    appBarBackgroundColorSRGB: any;
    panelBackgroundColorSRGB: any;
    systemHighlightColor: any;
}

declare interface HostEnvironment {
    appName: string;
    appVersion: any;
    appLocale: any;
    appUILocale: any;
    appId: string;
    isAppOnline: boolean;
    appSkinInfo: AppSkinInfo;
}

declare interface HostCapabilities {
    EXTENDED_PANEL_MENU: boolean;
    EXTENDED_PANEL_ICONS: boolean;
    DELEGATE_APE_ENGINE: boolean;
    SUPPORT_HTML_EXTENSIONS: boolean;
    DISABLE_FLASH_EXTENSIONS: boolean;
}

declare interface ApiVersion {
    major: number;
    minor: number;
    micro: number;
}

declare interface MenuItemStatus {
    menuItemLabel: string;
    enabled: boolean;
    checked: boolean;
}

declare interface ContextMenuItemStatus {
    menuItemID: string;
    enabled: boolean;
    checked: boolean;
}