#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use fs_tail::TailedFile;
use notify::{Watcher, RecursiveMode, Result,Event,EventKind};
use notify::event::CreateKind::Any;
use std::fs::File;
use std::io::BufRead;
use std::path::Path;
use std::thread::{spawn};
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![tail_file])
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let main_window = app.get_window("main").unwrap();
                main_window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Clone, serde::Serialize)]
struct Payload {
  data: String,
}

static mut file:Option<TailedFile>=None;
static mut file_path:String=String::new();
static mut app_object:Option<tauri::AppHandle>=None;

#[tauri::command]
//Dont delete this async, or software will no response
async fn tail_file(path:String, app: tauri::AppHandle){
    //watcher is for rename event
    let mut watcher = notify::recommended_watcher(|res:Result<Event>| {
        match res {
            Ok(event) => {
                if event.kind==EventKind::Create(Any){
                    println!("Game open triggered (File Creation), trying to re-tail");
                    unsafe{
                        file = Some(TailedFile::new(File::open(&file_path).unwrap()));
                    }
                    spawn(do_tail);
                }
            },
            Err(e) => println!("Watch error: {:?}", e),
        }
    }).expect("Watch file failed");
    let _=watcher.watch(Path::new(&path), RecursiveMode::Recursive);
    //idk how to use Box::leak lol
    unsafe{
        file = Some(TailedFile::new(File::open(&path).unwrap()));
        file_path = String::from(path);
        app_object=Some(app);
    }
    spawn(do_tail).join().unwrap();
}

fn do_tail(){
    println!("Start tailing");
    unsafe{
        match &file {
            Some(obj) => {
                for line in obj.lock().lines() {
                    if let Ok(line) = line {
                        println!("{}", line);
                        match &app_object{
                            Some(app)=>app.emit_all("log-line", Payload { data: line.into() }).unwrap(),
                            None => println!("None")
                        }
                    }
                }
            }, // Some: x=hello
            None => println!("None")
        }
    }
    println!("End tailing");
}