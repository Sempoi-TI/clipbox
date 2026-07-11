import { invoke, isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { writeText as writeNativeClipboardText } from '@tauri-apps/plugin-clipboard-manager';
import { open as openNativeDialog, save as saveNativeDialog } from '@tauri-apps/plugin-dialog';
import { readTextFile as readNativeTextFile, writeTextFile as writeNativeTextFile } from '@tauri-apps/plugin-fs';

type DesktopRuntimePlatform = 'macos' | 'windows' | 'linux' | 'unknown';
type DesktopWindowState = {
	maximized: boolean;
	focused: boolean;
};

function detectDesktopPlatform(): DesktopRuntimePlatform {
	const runtimeDetails = navigator.userAgent.toLowerCase();

	if (runtimeDetails.includes('mac')) return 'macos';
	if (runtimeDetails.includes('win')) return 'windows';
	if (runtimeDetails.includes('linux')) return 'linux';

	return 'unknown';
}

const desktopBridge: {
	isTauri: boolean;
	platform: DesktopRuntimePlatform;
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
	observeWindowState: (callback: (state: DesktopWindowState) => void) => Promise<() => void>;
} = {
	isTauri: false,
	platform: 'unknown',
	async writeClipboardText(_text: string): Promise<void> {
		throw new Error('Tauri runtime unavailable');
	},
	async loadStorage(): Promise<unknown> {
		return null;
	},
	async saveStorage(_payload: unknown): Promise<void> {
		throw new Error('Tauri runtime unavailable');
	},
	async openJsonFile(): Promise<string | null> {
		return null;
	},
	async saveJsonFile(_defaultFileName: string): Promise<string | null> {
		return null;
	},
	async readTextFile(_path: string): Promise<string> {
		throw new Error('Tauri runtime unavailable');
	},
	async writeTextFile(_path: string, _data: string): Promise<void> {
		throw new Error('Tauri runtime unavailable');
	},
	async minimizeWindow(): Promise<void> {
		throw new Error('Tauri runtime unavailable');
	},
	async toggleMaximizeWindow(): Promise<boolean> {
		throw new Error('Tauri runtime unavailable');
	},
	async closeWindow(): Promise<void> {
		throw new Error('Tauri runtime unavailable');
	},
	async isWindowMaximized(): Promise<boolean> {
		return false;
	},
	async observeWindowState(_callback: (state: DesktopWindowState) => void): Promise<() => void> {
		return () => {};
	}
};

if (isTauri()) {
	const appWindow = getCurrentWindow();

	desktopBridge.isTauri = true;
	desktopBridge.platform = detectDesktopPlatform();
	desktopBridge.writeClipboardText = async (text: string) => {
		await writeNativeClipboardText(text);
	};
	desktopBridge.loadStorage = async () => {
		return invoke('load_clipbox_storage');
	};
	desktopBridge.saveStorage = async (payload: unknown) => {
		await invoke('save_clipbox_storage', { payload });
	};
	desktopBridge.openJsonFile = async () => {
		const selected = await openNativeDialog({
			multiple: false,
			directory: false,
			filters: [{ name: 'JSON', extensions: ['json'] }]
		});
		return typeof selected === 'string' ? selected : null;
	};
	desktopBridge.saveJsonFile = async (defaultFileName: string) => {
		return saveNativeDialog({
			defaultPath: defaultFileName,
			filters: [{ name: 'JSON', extensions: ['json'] }]
		});
	};
	desktopBridge.readTextFile = async (path: string) => {
		return readNativeTextFile(path);
	};
	desktopBridge.writeTextFile = async (path: string, data: string) => {
		await writeNativeTextFile(path, data);
	};
	desktopBridge.minimizeWindow = async () => {
		await appWindow.minimize();
	};
	desktopBridge.toggleMaximizeWindow = async () => {
		await appWindow.toggleMaximize();
		return appWindow.isMaximized();
	};
	desktopBridge.closeWindow = async () => {
		await appWindow.close();
	};
	desktopBridge.isWindowMaximized = async () => {
		return appWindow.isMaximized();
	};
	desktopBridge.observeWindowState = async (callback: (state: DesktopWindowState) => void) => {
		const emitState = async () => {
			callback({
				maximized: await appWindow.isMaximized(),
				focused: await appWindow.isFocused()
			});
		};

		await emitState();

		const unlistenResized = await appWindow.onResized(() => {
			void emitState();
		});
		const unlistenFocus = await appWindow.onFocusChanged(() => {
			void emitState();
		});

		return () => {
			unlistenResized();
			unlistenFocus();
		};
	};
	document.documentElement.dataset.runtime = 'tauri';
	document.documentElement.dataset.desktopPlatform = desktopBridge.platform;
	document.documentElement.classList.add('runtime-tauri');
} else {
	document.documentElement.dataset.runtime = 'web';
}

Object.assign(window, {
	__CLIPBOX_DESKTOP__: desktopBridge
});

window.dispatchEvent(
	new CustomEvent('clipbox-desktop-ready', {
		detail: {
			isTauri: desktopBridge.isTauri,
			platform: desktopBridge.platform
		}
	})
);
