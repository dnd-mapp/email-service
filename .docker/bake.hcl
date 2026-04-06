variable "TAGS" {
    default = ["latest"]
    type = list(string)
}

group "default" {
    targets = ["app"]
}

target "app" {
    context = "."
    dockerfile = ".docker/Dockerfile"
    platforms = [
        "linux/amd64",
        "linux/arm64"
    ]
    tags = [for tag in TAGS : "dndmapp/auth-server:${tag}"]

    attest = [
        "type=sbom",
        "type=provenance,mode=max"
    ]
}
