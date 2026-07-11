use std::fs;

use serde_json::{json, Value};
use tauri::Manager;

fn default_clipbox_storage() -> Value {
  json!({
    "version": 1,
    "datasetMetadata": Value::Null,
    "datasets": {},
    "pinnedIds": [],
    "viewMode": "grid"
  })
}

fn clipbox_storage_path(app: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
  let app_data_dir = app
    .path()
    .app_data_dir()
    .map_err(|error| format!("Unable to resolve app data directory: {error}"))?;

  fs::create_dir_all(&app_data_dir)
    .map_err(|error| format!("Unable to create app data directory: {error}"))?;

  Ok(app_data_dir.join("clipbox-storage.json"))
}

#[tauri::command]
fn load_clipbox_storage(app: tauri::AppHandle) -> Result<Value, String> {
  let storage_path = clipbox_storage_path(&app)?;
  if !storage_path.exists() {
    return Ok(default_clipbox_storage());
  }

  let raw = fs::read_to_string(&storage_path)
    .map_err(|error| format!("Unable to read storage file: {error}"))?;

  if raw.trim().is_empty() {
    return Ok(default_clipbox_storage());
  }

  serde_json::from_str(&raw).map_err(|error| format!("Unable to parse storage file: {error}"))
}

#[tauri::command]
fn save_clipbox_storage(app: tauri::AppHandle, payload: Value) -> Result<(), String> {
  if !payload.is_object() {
    return Err("Storage payload must be a JSON object".into());
  }

  let storage_path = clipbox_storage_path(&app)?;
  let serialized = serde_json::to_string_pretty(&payload)
    .map_err(|error| format!("Unable to serialize storage payload: {error}"))?;

  fs::write(storage_path, serialized)
    .map_err(|error| format!("Unable to write storage file: {error}"))?;

  Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_clipboard_manager::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .invoke_handler(tauri::generate_handler![
      load_clipbox_storage,
      save_clipbox_storage
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
