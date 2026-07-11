type ClipBoxDesktopRuntimePlatform = 'macos' | 'windows' | 'linux' | 'unknown';

type ClipBoxDesktopWindowState = {
	maximized: boolean;
	focused: boolean;
};

type ClipBoxDesktopBridge = {
	isTauri: boolean;
	platform: ClipBoxDesktopRuntimePlatform;
	writeClipboardText: (text: string) => Promise<void>;
	loadStorage: () => Promise<unknown>;
	saveStorage: (payload: unknown) => Promise<void>;
	openJsonFile: () => Promise<string | null>;
	saveJsonFile: (defaultFileName: string) => Promise<string | null>;
	readTextFile: (path: string) => Promise<string>;
	writeTextFile: (path: string, data: string) => Promise<void>;
	minimizeWindow: () => Promise<void>;
	toggleMaximizeWindow: () => Promise<boolean>;
	closeWindow: () => Promise<void>;
	isWindowMaximized: () => Promise<boolean>;
	observeWindowState: (callback: (state: ClipBoxDesktopWindowState) => void) => Promise<() => void>;
};

declare global {
	interface Window {
		__CLIPBOX_DESKTOP__?: ClipBoxDesktopBridge;
	}
}

export {};
