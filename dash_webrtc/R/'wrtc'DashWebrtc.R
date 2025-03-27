# AUTO GENERATED FILE - DO NOT EDIT

#' @export
'wrtc'DashWebrtc <- function(id=NULL, autoStart=NULL, availableMediaDevices=NULL, capture=NULL, debug=NULL, errorMessage=NULL, hasError=NULL, iceServersConfig=NULL, incomingMediaElementsId=NULL, mediaDevicesConstraints=NULL, outgoingMediaElementsId=NULL, polite=NULL, refreshMediaDevices=NULL, signalingMaxRetries=NULL, signalingOpeningMessage=NULL, signalingRetryInterval=NULL, signalingUrl=NULL, status=NULL) {
    
    props <- list(id=id, autoStart=autoStart, availableMediaDevices=availableMediaDevices, capture=capture, debug=debug, errorMessage=errorMessage, hasError=hasError, iceServersConfig=iceServersConfig, incomingMediaElementsId=incomingMediaElementsId, mediaDevicesConstraints=mediaDevicesConstraints, outgoingMediaElementsId=outgoingMediaElementsId, polite=polite, refreshMediaDevices=refreshMediaDevices, signalingMaxRetries=signalingMaxRetries, signalingOpeningMessage=signalingOpeningMessage, signalingRetryInterval=signalingRetryInterval, signalingUrl=signalingUrl, status=status)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'DashWebrtc',
        namespace = 'dash_webrtc',
        propNames = c('id', 'autoStart', 'availableMediaDevices', 'capture', 'debug', 'errorMessage', 'hasError', 'iceServersConfig', 'incomingMediaElementsId', 'mediaDevicesConstraints', 'outgoingMediaElementsId', 'polite', 'refreshMediaDevices', 'signalingMaxRetries', 'signalingOpeningMessage', 'signalingRetryInterval', 'signalingUrl', 'status'),
        package = 'dashWebrtc'
        )

    structure(component, class = c('dash_component', 'list'))
}
