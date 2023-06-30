fn main() {
    tonic_build::configure()
        .build_server(true)
        // add serde attributes to generated code
        .type_attribute(".", "#[derive(serde::Serialize, serde::Deserialize)]")
        .type_attribute(".", "#[serde(rename_all = \"camelCase\")]")
        .type_attribute(".", "#[serde(default)]")
        .compile(&["../../proto/profile.proto"], &["../../proto"])
        .unwrap_or_else(|e| panic!("Failed to compile protos {:?}", e));
}
