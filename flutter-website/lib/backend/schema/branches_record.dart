import 'dart:async';

import 'package:collection/collection.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class BranchesRecord extends FirestoreRecord {
  BranchesRecord._(
    DocumentReference reference,
    Map<String, dynamic> data,
  ) : super(reference, data) {
    _initializeFields();
  }

  // "name" field.
  String? _name;
  String get name => _name ?? '';
  bool hasName() => _name != null;

  // "website" field.
  String? _website;
  String get website => _website ?? '';
  bool hasWebsite() => _website != null;

  // "Image" field.
  String? _image;
  String get image => _image ?? '';
  bool hasImage() => _image != null;

  // "location" field.
  String? _location;
  String get location => _location ?? '';
  bool hasLocation() => _location != null;

  // "country" field.
  String? _country;
  String get country => _country ?? '';
  bool hasCountry() => _country != null;

  // "date" field.
  DateTime? _date;
  DateTime? get date => _date;
  bool hasDate() => _date != null;

  // "locationPIN" field.
  LatLng? _locationPIN;
  LatLng? get locationPIN => _locationPIN;
  bool hasLocationPIN() => _locationPIN != null;

  // "bankingDetails" field.
  String? _bankingDetails;
  String get bankingDetails => _bankingDetails ?? '';
  bool hasBankingDetails() => _bankingDetails != null;

  // "pastor" field.
  DocumentReference? _pastor;
  DocumentReference? get pastor => _pastor;
  bool hasPastor() => _pastor != null;

  // "email" field.
  String? _email;
  String get email => _email ?? '';
  bool hasEmail() => _email != null;

  // "whatsapp" field.
  String? _whatsapp;
  String get whatsapp => _whatsapp ?? '';
  bool hasWhatsapp() => _whatsapp != null;

  // "instagram" field.
  String? _instagram;
  String get instagram => _instagram ?? '';
  bool hasInstagram() => _instagram != null;

  // "facebook" field.
  String? _facebook;
  String get facebook => _facebook ?? '';
  bool hasFacebook() => _facebook != null;

  // "youtube" field.
  String? _youtube;
  String get youtube => _youtube ?? '';
  bool hasYoutube() => _youtube != null;

  // "phone_number" field.
  String? _phoneNumber;
  String get phoneNumber => _phoneNumber ?? '';
  bool hasPhoneNumber() => _phoneNumber != null;

  // "googlepay" field.
  String? _googlepay;
  String get googlepay => _googlepay ?? '';
  bool hasGooglepay() => _googlepay != null;

  // "applepay" field.
  String? _applepay;
  String get applepay => _applepay ?? '';
  bool hasApplepay() => _applepay != null;

  // "paypal" field.
  String? _paypal;
  String get paypal => _paypal ?? '';
  bool hasPaypal() => _paypal != null;

  // "yoco" field.
  String? _yoco;
  String get yoco => _yoco ?? '';
  bool hasYoco() => _yoco != null;

  void _initializeFields() {
    _name = snapshotData['name'] as String?;
    _website = snapshotData['website'] as String?;
    _image = snapshotData['Image'] as String?;
    _location = snapshotData['location'] as String?;
    _country = snapshotData['country'] as String?;
    _date = snapshotData['date'] as DateTime?;
    _locationPIN = snapshotData['locationPIN'] as LatLng?;
    _bankingDetails = snapshotData['bankingDetails'] as String?;
    _pastor = snapshotData['pastor'] as DocumentReference?;
    _email = snapshotData['email'] as String?;
    _whatsapp = snapshotData['whatsapp'] as String?;
    _instagram = snapshotData['instagram'] as String?;
    _facebook = snapshotData['facebook'] as String?;
    _youtube = snapshotData['youtube'] as String?;
    _phoneNumber = snapshotData['phone_number'] as String?;
    _googlepay = snapshotData['googlepay'] as String?;
    _applepay = snapshotData['applepay'] as String?;
    _paypal = snapshotData['paypal'] as String?;
    _yoco = snapshotData['yoco'] as String?;
  }

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('branches');

  static Stream<BranchesRecord> getDocument(DocumentReference ref) =>
      ref.snapshots().map((s) => BranchesRecord.fromSnapshot(s));

  static Future<BranchesRecord> getDocumentOnce(DocumentReference ref) =>
      ref.get().then((s) => BranchesRecord.fromSnapshot(s));

  static BranchesRecord fromSnapshot(DocumentSnapshot snapshot) =>
      BranchesRecord._(
        snapshot.reference,
        mapFromFirestore(snapshot.data() as Map<String, dynamic>),
      );

  static BranchesRecord getDocumentFromData(
    Map<String, dynamic> data,
    DocumentReference reference,
  ) =>
      BranchesRecord._(reference, mapFromFirestore(data));

  @override
  String toString() =>
      'BranchesRecord(reference: ${reference.path}, data: $snapshotData)';

  @override
  int get hashCode => reference.path.hashCode;

  @override
  bool operator ==(other) =>
      other is BranchesRecord &&
      reference.path.hashCode == other.reference.path.hashCode;
}

Map<String, dynamic> createBranchesRecordData({
  String? name,
  String? website,
  String? image,
  String? location,
  String? country,
  DateTime? date,
  LatLng? locationPIN,
  String? bankingDetails,
  DocumentReference? pastor,
  String? email,
  String? whatsapp,
  String? instagram,
  String? facebook,
  String? youtube,
  String? phoneNumber,
  String? googlepay,
  String? applepay,
  String? paypal,
  String? yoco,
}) {
  final firestoreData = mapToFirestore(
    <String, dynamic>{
      'name': name,
      'website': website,
      'Image': image,
      'location': location,
      'country': country,
      'date': date,
      'locationPIN': locationPIN,
      'bankingDetails': bankingDetails,
      'pastor': pastor,
      'email': email,
      'whatsapp': whatsapp,
      'instagram': instagram,
      'facebook': facebook,
      'youtube': youtube,
      'phone_number': phoneNumber,
      'googlepay': googlepay,
      'applepay': applepay,
      'paypal': paypal,
      'yoco': yoco,
    }.withoutNulls,
  );

  return firestoreData;
}

class BranchesRecordDocumentEquality implements Equality<BranchesRecord> {
  const BranchesRecordDocumentEquality();

  @override
  bool equals(BranchesRecord? e1, BranchesRecord? e2) {
    return e1?.name == e2?.name &&
        e1?.website == e2?.website &&
        e1?.image == e2?.image &&
        e1?.location == e2?.location &&
        e1?.country == e2?.country &&
        e1?.date == e2?.date &&
        e1?.locationPIN == e2?.locationPIN &&
        e1?.bankingDetails == e2?.bankingDetails &&
        e1?.pastor == e2?.pastor &&
        e1?.email == e2?.email &&
        e1?.whatsapp == e2?.whatsapp &&
        e1?.instagram == e2?.instagram &&
        e1?.facebook == e2?.facebook &&
        e1?.youtube == e2?.youtube &&
        e1?.phoneNumber == e2?.phoneNumber &&
        e1?.googlepay == e2?.googlepay &&
        e1?.applepay == e2?.applepay &&
        e1?.paypal == e2?.paypal &&
        e1?.yoco == e2?.yoco;
  }

  @override
  int hash(BranchesRecord? e) => const ListEquality().hash([
        e?.name,
        e?.website,
        e?.image,
        e?.location,
        e?.country,
        e?.date,
        e?.locationPIN,
        e?.bankingDetails,
        e?.pastor,
        e?.email,
        e?.whatsapp,
        e?.instagram,
        e?.facebook,
        e?.youtube,
        e?.phoneNumber,
        e?.googlepay,
        e?.applepay,
        e?.paypal,
        e?.yoco
      ]);

  @override
  bool isValidKey(Object? o) => o is BranchesRecord;
}
