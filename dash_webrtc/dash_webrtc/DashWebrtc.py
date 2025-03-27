# AUTO GENERATED FILE - DO NOT EDIT

import typing  # noqa: F401
import numbers # noqa: F401
from typing_extensions import TypedDict, NotRequired, Literal # noqa: F401
from dash.development.base_component import Component, _explicitize_args
try:
    from dash.development.base_component import ComponentType # noqa: F401
except ImportError:
    ComponentType = typing.TypeVar("ComponentType", bound=Component)


class DashWebrtc(Component):
    """A DashWebrtc component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.

Keyword arguments:

- id (string; optional):
    The ID used to identify this component in Dash callbacks.

- autoStart (boolean; default False):
    Démarer automatiquement la capture.

- availableMediaDevices (dict; optional):
    Propriété utilisée pour renvoyer la liste des périphériques médias
    disponibles.  Déclenchée par la méthode getMediaDevices().

- capture (boolean; default False):
    Contrôle l'état de capture (True = démarrer, False = arrêter).

- debug (boolean; default False):
    Debug mode for conditional logging.

- errorMessage (string; optional):
    Message d'erreur actuel (le cas échéant).

- hasError (boolean; optional):
    Si une erreur est survenue.

- iceServersConfig (dict; optional):
    Configuration des serveurs ICE utilisés pour les connexions
    WebRTC.  Permet de personnaliser les serveurs STUN/TURN pour
    traverser les NAT et firewalls.  Si non fourni, une configuration
    par défaut avec des serveurs publics est utilisée.

    `iceServersConfig` is a dict with keys:

    - iceServers (list of dicts; optional)

        `iceServers` is a list of dicts with keys:

        - urls (string | list of strings; required)

        - username (string; optional)

        - credential (string; optional)

    - iceCandidatePoolSize (number; optional)

    - iceTransportPolicy (a value equal to: 'all', 'relay'; optional)

- incomingMediaElementsId (list; optional):
    ID de l'élément audio/video HTML à connecter au flux entrant.

- mediaDevicesConstraints (dict; default { audio: True, video: True }):
    Contraintes de capture des médias (audio, vidéo), voir
    https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    L'objet est un dictionnaire de clés (audio, video) avec des
    valeurs de contraintes.   Par défault on capture seulement l'audio
    : { audio: True, video: False }  Exemple :  { audio: {
    echoCancellation: True, noiseSuppression: True }, video: { width:
    1280, height: 720 } }.

- outgoingMediaElementsId (list; optional):
    ID de l'élément audio/video HTML à connecter au flux sortant.

- polite (boolean; default True):
    Controle si le composant doit attendre de recevoir une offre avant
    d'en créer une (True, polie) ou si il peut initier une offre sans
    attendre (False, impolie).

- refreshMediaDevices (number; default 0):
    Déclenche l'énumération des périphériques médias.  Incrémentez
    cette valeur pour lancer l'énumération.

- signalingMaxRetries (number; default 3):
    Nombre maximal de tentatives de reconnexion de la connection
    websocket en cas d'échec.  @default 3  @type {number}.

- signalingOpeningMessage (dict; optional):
    Message d'ouverture à envoyer lors de la connexion.  @default None
    @type {Object}  @example  {          \"type\": \"join\",
    \"room\": \"my-room\"        }.

- signalingRetryInterval (number; default 1000):
    Intervalle entre les tentatives de reconnexion en millisecondes.
    @default 1000  @type {number}  @example.

- signalingUrl (string; optional):
    URL du serveur de signalisation WebSocket.

- status (string; optional):
    Status actuel (le cas échéant)."""
    _children_props = []
    _base_nodes = ['children']
    _namespace = 'dash_webrtc'
    _type = 'DashWebrtc'
    IceServersConfigIceServers = TypedDict(
        "IceServersConfigIceServers",
            {
            "urls": typing.Union[str, typing.Sequence[str]],
            "username": NotRequired[str],
            "credential": NotRequired[str]
        }
    )

    IceServersConfig = TypedDict(
        "IceServersConfig",
            {
            "iceServers": NotRequired[typing.Sequence["IceServersConfigIceServers"]],
            "iceCandidatePoolSize": NotRequired[typing.Union[int, float, numbers.Number]],
            "iceTransportPolicy": NotRequired[Literal["all", "relay"]]
        }
    )

    @_explicitize_args
    def __init__(
        self,
        id: typing.Optional[typing.Union[str, dict]] = None,
        debug: typing.Optional[bool] = None,
        hasError: typing.Optional[bool] = None,
        errorMessage: typing.Optional[str] = None,
        status: typing.Optional[str] = None,
        iceServersConfig: typing.Optional["IceServersConfig"] = None,
        polite: typing.Optional[bool] = None,
        mediaDevicesConstraints: typing.Optional[dict] = None,
        autoStart: typing.Optional[bool] = None,
        capture: typing.Optional[bool] = None,
        incomingMediaElementsId: typing.Optional[typing.Sequence] = None,
        outgoingMediaElementsId: typing.Optional[typing.Sequence] = None,
        availableMediaDevices: typing.Optional[dict] = None,
        refreshMediaDevices: typing.Optional[typing.Union[int, float, numbers.Number]] = None,
        signalingUrl: typing.Optional[str] = None,
        signalingMaxRetries: typing.Optional[typing.Union[int, float, numbers.Number]] = None,
        signalingRetryInterval: typing.Optional[typing.Union[int, float, numbers.Number]] = None,
        signalingOpeningMessage: typing.Optional[dict] = None,
        **kwargs
    ):
        self._prop_names = ['id', 'autoStart', 'availableMediaDevices', 'capture', 'debug', 'errorMessage', 'hasError', 'iceServersConfig', 'incomingMediaElementsId', 'mediaDevicesConstraints', 'outgoingMediaElementsId', 'polite', 'refreshMediaDevices', 'signalingMaxRetries', 'signalingOpeningMessage', 'signalingRetryInterval', 'signalingUrl', 'status']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'autoStart', 'availableMediaDevices', 'capture', 'debug', 'errorMessage', 'hasError', 'iceServersConfig', 'incomingMediaElementsId', 'mediaDevicesConstraints', 'outgoingMediaElementsId', 'polite', 'refreshMediaDevices', 'signalingMaxRetries', 'signalingOpeningMessage', 'signalingRetryInterval', 'signalingUrl', 'status']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        super(DashWebrtc, self).__init__(**args)
