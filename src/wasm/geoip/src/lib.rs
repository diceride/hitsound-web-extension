//use maxminddb::geoip2::City;
use std::cell::RefCell;
use std::io::BufReader;
//use std::net::IpAddr;
use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

thread_local! {
    static READER: RefCell<Option<maxminddb::Reader<Vec<u8>>>> = RefCell::new(None);
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn init_reader(bytes: &[u8]) -> Result<(), JsValue> {
    //let mut reader = READER.lock().unwrap();

    let mut buf_reader = BufReader::with_capacity(bytes.len(), bytes);

    let decode_options = lzma_rs::decompress::Options {
        unpacked_size: lzma_rs::decompress::UnpackedSize::ReadFromHeader,
        ..Default::default()
    };

    let mut data: Vec<u8> = Vec::new();

    lzma_rs::lzma_decompress_with_options(&mut buf_reader, &mut data, &decode_options).map_err(
        |err| JsValue::from(format!("{:?} (capacity: {:})", err, buf_reader.capacity())),
    )?;

    //READER.with(maxminddb::Reader::from_source(&data).unwrap());

    Ok(())
}

#[wasm_bindgen]
pub fn lookup(_ip_address: String) -> Result<String, JsValue> {
    //let city: City = READER.lookup(IpAddr::from_str(&ip_address).unwrap()).unwrap();

    //log(&format!("city: {:?}", city));

    Ok("test".to_string())
}

fn main() {}
