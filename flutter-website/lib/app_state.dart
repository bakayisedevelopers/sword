import 'package:flutter/material.dart';
import '/backend/backend.dart';
import '/backend/schema/structs/index.dart';
import '/backend/schema/enums/enums.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'flutter_flow/flutter_flow_util.dart';

class FFAppState extends ChangeNotifier {
  static FFAppState _instance = FFAppState._internal();

  factory FFAppState() {
    return _instance;
  }

  FFAppState._internal();

  static void reset() {
    _instance = FFAppState._internal();
  }

  Future initializePersistedState() async {
    prefs = await SharedPreferences.getInstance();
    _safeInit(() {
      if (prefs.containsKey('ff_users')) {
        try {
          final serializedData = prefs.getString('ff_users') ?? '{}';
          _users = UserStruct.fromSerializableMap(jsonDecode(serializedData));
        } catch (e) {
          print("Can't decode persisted data type. Error: $e.");
        }
      }
    });
  }

  void update(VoidCallback callback) {
    callback();
    notifyListeners();
  }

  late SharedPreferences prefs;

  List<ProductStruct> _products = [
    ProductStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Sandwich\",\"desc\":\"Pr. \$ 0.30\",\"options\":\"[\\\"1 Person\\\",\\\"2 Person\\\",\\\"3 Person\\\"]\",\"image\":\"https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/landing-page-fswu4g/assets/5tymf4mmuwu8/Untitled_design(16).png\"}')),
    ProductStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Pizza\",\"desc\":\"Pr. \$ 0.80\",\"options\":\"[\\\"1 Person\\\",\\\"2 Person\\\",\\\"3 Person\\\"]\",\"image\":\"https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/landing-page-fswu4g/assets/c05itu78occ4/Untitled_design(4).png\"}')),
    ProductStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Biryani\",\"desc\":\"Pr. \$ 1.30\",\"options\":\"[\\\"1 Person\\\"]\",\"image\":\"https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/landing-page-fswu4g/assets/nqha850upe2f/Untitled_design(3).png\"}')),
    ProductStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Burger\",\"desc\":\"Pr. \$ 2.10\",\"options\":\"[\\\"1 Person\\\",\\\"2 Person\\\"]\",\"image\":\"https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/landing-page-fswu4g/assets/qst8u3fdk2wp/Untitled_design(7).png\"}')),
    ProductStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Pizza\",\"desc\":\"Pr. \$ 0.60\",\"options\":\"[\\\"1 Person\\\",\\\"2 Person\\\",\\\"3 Person\\\"]\",\"image\":\"https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/landing-page-fswu4g/assets/g6h7nj8w2gb6/Food_10.png\"}')),
    ProductStruct.fromSerializableMap(jsonDecode(
        '{\"title\":\"Pizza\",\"desc\":\"Pr. \$ 1.30\",\"options\":\"[\\\"1 Person\\\",\\\"2 Person\\\",\\\"3 Person\\\"]\",\"image\":\"https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/landing-page-fswu4g/assets/y0gqqhtv2i0z/Food_11.png\"}'))
  ];
  List<ProductStruct> get products => _products;
  set products(List<ProductStruct> value) {
    _products = value;
  }

  void addToProducts(ProductStruct value) {
    products.add(value);
  }

  void removeFromProducts(ProductStruct value) {
    products.remove(value);
  }

  void removeAtIndexFromProducts(int index) {
    products.removeAt(index);
  }

  void updateProductsAtIndex(
    int index,
    ProductStruct Function(ProductStruct) updateFn,
  ) {
    products[index] = updateFn(_products[index]);
  }

  void insertAtIndexInProducts(int index, ProductStruct value) {
    products.insert(index, value);
  }

  List<MenuStruct> _menus = [
    MenuStruct.fromSerializableMap(
        jsonDecode('{\"title\":\"Burger\",\"desc\":\"Pr. \$ 1.30\"}')),
    MenuStruct.fromSerializableMap(
        jsonDecode('{\"title\":\"Biryani\",\"desc\":\"Pr. \$ 0.30\"}')),
    MenuStruct.fromSerializableMap(
        jsonDecode('{\"title\":\"Pizza\",\"desc\":\"Pr. \$ 0.30\"}')),
    MenuStruct.fromSerializableMap(
        jsonDecode('{\"title\":\"Sandwich\",\"desc\":\"Pr. \$ 0.30\"}'))
  ];
  List<MenuStruct> get menus => _menus;
  set menus(List<MenuStruct> value) {
    _menus = value;
  }

  void addToMenus(MenuStruct value) {
    menus.add(value);
  }

  void removeFromMenus(MenuStruct value) {
    menus.remove(value);
  }

  void removeAtIndexFromMenus(int index) {
    menus.removeAt(index);
  }

  void updateMenusAtIndex(
    int index,
    MenuStruct Function(MenuStruct) updateFn,
  ) {
    menus[index] = updateFn(_menus[index]);
  }

  void insertAtIndexInMenus(int index, MenuStruct value) {
    menus.insert(index, value);
  }

  UserStruct _users = UserStruct.fromSerializableMap(jsonDecode(
      '{\"name\":\"Ahmed\",\"avatar\":\"https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/landing-page-fswu4g/assets/ikkhjvfbats7/LogoD.png\",\"cart\":\"[\\\"{\\\\\\\"title\\\\\\\":\\\\\\\"Burger\\\\\\\",\\\\\\\"desc\\\\\\\":\\\\\\\"Pr. \$ 0.30\\\\\\\",\\\\\\\"options\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1 Person\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"image\\\\\\\":\\\\\\\"hhttps://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/landing-page-fswu4g/assets/qst8u3fdk2wp/Untitled_design(7).png\\\\\\\"}\\\",\\\"{\\\\\\\"title\\\\\\\":\\\\\\\"Biryani\\\\\\\",\\\\\\\"desc\\\\\\\":\\\\\\\"Pr. \$ 0.30\\\\\\\",\\\\\\\"options\\\\\\\":\\\\\\\"[\\\\\\\\\\\\\\\"1 Person\\\\\\\\\\\\\\\"]\\\\\\\",\\\\\\\"image\\\\\\\":\\\\\\\"https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/landing-page-fswu4g/assets/nqha850upe2f/Untitled_design(3).png\\\\\\\"}\\\"]\"}'));
  UserStruct get users => _users;
  set users(UserStruct value) {
    _users = value;
    prefs.setString('ff_users', value.serialize());
  }

  void updateUsersStruct(Function(UserStruct) updateFn) {
    updateFn(_users);
    prefs.setString('ff_users', _users.serialize());
  }

  bool _fireConference = false;
  bool get fireConference => _fireConference;
  set fireConference(bool value) {
    _fireConference = value;
  }

  bool _campYolo = false;
  bool get campYolo => _campYolo;
  set campYolo(bool value) {
    _campYolo = value;
  }

  bool _supermanConference = false;
  bool get supermanConference => _supermanConference;
  set supermanConference(bool value) {
    _supermanConference = value;
  }

  LatLng? _selectedLocations;
  LatLng? get selectedLocations => _selectedLocations;
  set selectedLocations(LatLng? value) {
    _selectedLocations = value;
  }

  String _selectedLocation = 'Online';
  String get selectedLocation => _selectedLocation;
  set selectedLocation(String value) {
    _selectedLocation = value;
  }

  DocumentReference? _welfare;
  DocumentReference? get welfare => _welfare;
  set welfare(DocumentReference? value) {
    _welfare = value;
  }

  DocumentReference? _checkIns;
  DocumentReference? get checkIns => _checkIns;
  set checkIns(DocumentReference? value) {
    _checkIns = value;
  }

  DocumentReference? _prayer;
  DocumentReference? get prayer => _prayer;
  set prayer(DocumentReference? value) {
    _prayer = value;
  }

  DocumentReference? _counseling;
  DocumentReference? get counseling => _counseling;
  set counseling(DocumentReference? value) {
    _counseling = value;
  }

  String _signUpMinistry = '';
  String get signUpMinistry => _signUpMinistry;
  set signUpMinistry(String value) {
    _signUpMinistry = value;
  }

  String _requestType = '';
  String get requestType => _requestType;
  set requestType(String value) {
    _requestType = value;
  }

  String _FEWDS = '';
  String get FEWDS => _FEWDS;
  set FEWDS(String value) {
    _FEWDS = value;
  }

  String _signUpBranch = '';
  String get signUpBranch => _signUpBranch;
  set signUpBranch(String value) {
    _signUpBranch = value;
  }

  bool _addKids = false;
  bool get addKids => _addKids;
  set addKids(bool value) {
    _addKids = value;
  }

  DocumentReference? _sermons;
  DocumentReference? get sermons => _sermons;
  set sermons(DocumentReference? value) {
    _sermons = value;
  }

  String _requestBranch = '';
  String get requestBranch => _requestBranch;
  set requestBranch(String value) {
    _requestBranch = value;
  }

  String _contactBranch = '';
  String get contactBranch => _contactBranch;
  set contactBranch(String value) {
    _contactBranch = value;
  }

  bool _hideSocials = false;
  bool get hideSocials => _hideSocials;
  set hideSocials(bool value) {
    _hideSocials = value;
  }

  String _registerBranch = '';
  String get registerBranch => _registerBranch;
  set registerBranch(String value) {
    _registerBranch = value;
  }
}

void _safeInit(Function() initializeField) {
  try {
    initializeField();
  } catch (_) {}
}

Future _safeInitAsync(Function() initializeField) async {
  try {
    await initializeField();
  } catch (_) {}
}
