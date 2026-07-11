import { invoke, isTauri } from '@tauri-apps/api/core';
import { writeText as writeNativeClipboardText } from '@tauri-apps/plugin-clipboard-manager';
import { open as openNativeDialog, save as saveNativeDialog } from '@tauri-apps/plugin-dialog';
import { readTextFile as readNativeTextFile, writeTextFile as writeNativeTextFile } from '@tauri-apps/plugin-fs';

const desktopBridge: {
	isTauri: boolean;
	writeClipboardText: (text: string) => Promise<void>;
	loadStorage: () => Promise<unknown>;
	saveStorage: (payload: unknown) => Promise<void>;
	openJsonFile: () => Promise<string | null>;
	saveJsonFile: (defaultFileName: string) => Promise<string | null>;
	readTextFile: (path: string) => Promise<string>;
	writeTextFile: (path: string, data: string) => Promise<void>;
} = {
	isTauri: false,
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
	}
};

if (isTauri()) {
	desktopBridge.isTauri = true;
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
	document.documentElement.dataset.runtime = 'tauri';
	document.documentElement.classList.add('runtime-tauri');
} else {
	document.documentElement.dataset.runtime = 'web';
}

Object.assign(window, {
	__CLIPBOX_DESKTOP__: desktopBridge
});
