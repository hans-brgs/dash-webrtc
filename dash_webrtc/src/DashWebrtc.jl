
module DashWebrtc
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.1"

include("jl/'wrtc'_dashwebrtc.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_webrtc",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "async-DashWebrtc.js",
    external_url = "https://unpkg.com/dash_webrtc@0.0.1/dash_webrtc/async-DashWebrtc.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-DashWebrtc.js.map",
    external_url = "https://unpkg.com/dash_webrtc@0.0.1/dash_webrtc/async-DashWebrtc.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_webrtc.min.js",
    external_url = nothing,
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_webrtc.min.js.map",
    external_url = nothing,
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
