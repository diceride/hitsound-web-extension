use maxminddb::geoip2::City;
use once_cell::sync::OnceCell;
use std::io::BufReader;
use std::net::IpAddr;
use std::str::FromStr;
use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

static READER: OnceCell<maxminddb::Reader<Vec<u8>>> = OnceCell::new();

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn init_reader(bytes: &[u8]) -> Result<(), JsValue> {
    let mut buf_reader = BufReader::with_capacity(bytes.len(), bytes);

    let decode_options = lzma_rs::decompress::Options {
        unpacked_size: lzma_rs::decompress::UnpackedSize::ReadFromHeader,
        ..Default::default()
    };

    let mut data: Vec<u8> = Vec::new();

    lzma_rs::lzma_decompress_with_options(&mut buf_reader, &mut data, &decode_options).map_err(
        |err| JsValue::from(format!("{:?} (capacity: {:})", err, buf_reader.capacity())),
    )?;

    let _ = READER.set(maxminddb::Reader::from_source(data).unwrap());

    Ok(())
}

#[wasm_bindgen]
pub fn lookup(ip_addr: String) -> Result<String, JsValue> {
    log(&ip_addr);
    let ip_addr = IpAddr::from_str(&ip_addr).unwrap();

    let city: City = READER.get().unwrap().lookup(ip_addr).unwrap();

    Ok(format!("{:?}", city))
}

fn main() {}
