#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use fs_tail::TailedFile;
use std::fs::File;
use std::io::BufRead;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![tail_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Clone, serde::Serialize)]
struct Payload {
  data: String,
}

#[tauri::command]
async fn tail_file(path:String, app: tauri::AppHandle){
    let file = File::open(path).unwrap();
    let file = TailedFile::new(file);
    let locked = file.lock();
    println!("Start tailing");
    for line in locked.lines() {
        if let Ok(line) = line {
            println!("{}", line);
            app.emit_all("log-line", Payload { data: line.into() }).unwrap();
        }
    }
    println!("End tailing");
}