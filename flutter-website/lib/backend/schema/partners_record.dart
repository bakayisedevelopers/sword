import 'dart:async';

import 'package:collection/collection.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class PartnersRecord extends FirestoreRecord {
  PartnersRecord._(
    DocumentReference reference,
    Map<String, dynamic> data,
  ) : super(reference, data) {
    _initializeFields();
  }

  // "name" field.
  String? _name;
  String get name => _name ?? '';
  bool hasName() => _name != null;

  // "surname" field.
  String? _surname;
  String get surname => _surname ?? '';
  bool hasSurname() => _surname != null;

  // "DOB" field.
  DateTime? _dob;
  DateTime? get dob => _dob;
  bool hasDob() => _dob != null;

  // "Occupation" field.
  String? _occupation;
  String get occupation => _occupation ?? '';
  bool hasOccupation() => _occupation != null;

  // "workplace" field.
  String? _workplace;
  String get workplace => _workplace ?? '';
  bool hasWorkplace() => _workplace != null;

  // "address" field.
  String? _address;
  String get address => _address ?? '';
  bool hasAddress() => _address != null;

  // "cell" field.
  String? _cell;
  String get cell => _cell ?? '';
  bool hasCell() => _cell != null;

  // "email" field.
  String? _email;
  String get email => _email ?? '';
  bool hasEmail() => _email != null;

  // "bornAgain" field.
  String? _bornAgain;
  String get bornAgain => _bornAgain ?? '';
  bool hasBornAgain() => _bornAgain != null;

  // "bornAgainDate" field.
  DateTime? _bornAgainDate;
  DateTime? get bornAgainDate => _bornAgainDate;
  bool hasBornAgainDate() => _bornAgainDate != null;

  // "baptised" field.
  String? _baptised;
  String get baptised => _baptised ?? '';
  bool hasBaptised() => _baptised != null;

  // "filled" field.
  String? _filled;
  String get filled => _filled ?? '';
  bool hasFilled() => _filled != null;

  // "tongues" field.
  String? _tongues;
  String get tongues => _tongues ?? '';
  bool hasTongues() => _tongues != null;

  // "homeCell" field.
  String? _homeCell;
  String get homeCell => _homeCell ?? '';
  bool hasHomeCell() => _homeCell != null;

  // "homeCellName" field.
  String? _homeCellName;
  String get homeCellName => _homeCellName ?? '';
  bool hasHomeCellName() => _homeCellName != null;

  // "kid" field.
  String? _kid;
  String get kid => _kid ?? '';
  bool hasKid() => _kid != null;

  // "parent" field.
  DocumentReference? _parent;
  DocumentReference? get parent => _parent;
  bool hasParent() => _parent != null;

  // "branch" field.
  String? _branch;
  String get branch => _branch ?? '';
  bool hasBranch() => _branch != null;

  // "postalCode" field.
  String? _postalCode;
  String get postalCode => _postalCode ?? '';
  bool hasPostalCode() => _postalCode != null;

  void _initializeFields() {
    _name = snapshotData['name'] as String?;
    _surname = snapshotData['surname'] as String?;
    _dob = snapshotData['DOB'] as DateTime?;
    _occupation = snapshotData['Occupation'] as String?;
    _workplace = snapshotData['workplace'] as String?;
    _address = snapshotData['address'] as String?;
    _cell = snapshotData['cell'] as String?;
    _email = snapshotData['email'] as String?;
    _bornAgain = snapshotData['bornAgain'] as String?;
    _bornAgainDate = snapshotData['bornAgainDate'] as DateTime?;
    _baptised = snapshotData['baptised'] as String?;
    _filled = snapshotData['filled'] as String?;
    _tongues = snapshotData['tongues'] as String?;
    _homeCell = snapshotData['homeCell'] as String?;
    _homeCellName = snapshotData['homeCellName'] as String?;
    _kid = snapshotData['kid'] as String?;
    _parent = snapshotData['parent'] as DocumentReference?;
    _branch = snapshotData['branch'] as String?;
    _postalCode = snapshotData['postalCode'] as String?;
  }

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('partners');

  static Stream<PartnersRecord> getDocument(DocumentReference ref) =>
      ref.snapshots().map((s) => PartnersRecord.fromSnapshot(s));

  static Future<PartnersRecord> getDocumentOnce(DocumentReference ref) =>
      ref.get().then((s) => PartnersRecord.fromSnapshot(s));

  static PartnersRecord fromSnapshot(DocumentSnapshot snapshot) =>
      PartnersRecord._(
        snapshot.reference,
        mapFromFirestore(snapshot.data() as Map<String, dynamic>),
      );

  static PartnersRecord getDocumentFromData(
    Map<String, dynamic> data,
    DocumentReference reference,
  ) =>
      PartnersRecord._(reference, mapFromFirestore(data));

  @override
  String toString() =>
      'PartnersRecord(reference: ${reference.path}, data: $snapshotData)';

  @override
  int get hashCode => reference.path.hashCode;

  @override
  bool operator ==(other) =>
      other is PartnersRecord &&
      reference.path.hashCode == other.reference.path.hashCode;
}

Map<String, dynamic> createPartnersRecordData({
  String? name,
  String? surname,
  DateTime? dob,
  String? occupation,
  String? workplace,
  String? address,
  String? cell,
  String? email,
  String? bornAgain,
  DateTime? bornAgainDate,
  String? baptised,
  String? filled,
  String? tongues,
  String? homeCell,
  String? homeCellName,
  String? kid,
  DocumentReference? parent,
  String? branch,
  String? postalCode,
}) {
  final firestoreData = mapToFirestore(
    <String, dynamic>{
      'name': name,
      'surname': surname,
      'DOB': dob,
      'Occupation': occupation,
      'workplace': workplace,
      'address': address,
      'cell': cell,
      'email': email,
      'bornAgain': bornAgain,
      'bornAgainDate': bornAgainDate,
      'baptised': baptised,
      'filled': filled,
      'tongues': tongues,
      'homeCell': homeCell,
      'homeCellName': homeCellName,
      'kid': kid,
      'parent': parent,
      'branch': branch,
      'postalCode': postalCode,
    }.withoutNulls,
  );

  return firestoreData;
}

class PartnersRecordDocumentEquality implements Equality<PartnersRecord> {
  const PartnersRecordDocumentEquality();

  @override
  bool equals(PartnersRecord? e1, PartnersRecord? e2) {
    return e1?.name == e2?.name &&
        e1?.surname == e2?.surname &&
        e1?.dob == e2?.dob &&
        e1?.occupation == e2?.occupation &&
        e1?.workplace == e2?.workplace &&
        e1?.address == e2?.address &&
        e1?.cell == e2?.cell &&
        e1?.email == e2?.email &&
        e1?.bornAgain == e2?.bornAgain &&
        e1?.bornAgainDate == e2?.bornAgainDate &&
        e1?.baptised == e2?.baptised &&
        e1?.filled == e2?.filled &&
        e1?.tongues == e2?.tongues &&
        e1?.homeCell == e2?.homeCell &&
        e1?.homeCellName == e2?.homeCellName &&
        e1?.kid == e2?.kid &&
        e1?.parent == e2?.parent &&
        e1?.branch == e2?.branch &&
        e1?.postalCode == e2?.postalCode;
  }

  @override
  int hash(PartnersRecord? e) => const ListEquality().hash([
        e?.name,
        e?.surname,
        e?.dob,
        e?.occupation,
        e?.workplace,
        e?.address,
        e?.cell,
        e?.email,
        e?.bornAgain,
        e?.bornAgainDate,
        e?.baptised,
        e?.filled,
        e?.tongues,
        e?.homeCell,
        e?.homeCellName,
        e?.kid,
        e?.parent,
        e?.branch,
        e?.postalCode
      ]);

  @override
  bool isValidKey(Object? o) => o is PartnersRecord;
}
