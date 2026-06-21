import 'dart:async';

import 'package:collection/collection.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class MinistriesRecord extends FirestoreRecord {
  MinistriesRecord._(
    DocumentReference reference,
    Map<String, dynamic> data,
  ) : super(reference, data) {
    _initializeFields();
  }

  // "name" field.
  String? _name;
  String get name => _name ?? '';
  bool hasName() => _name != null;

  // "description" field.
  String? _description;
  String get description => _description ?? '';
  bool hasDescription() => _description != null;

  // "picture" field.
  String? _picture;
  String get picture => _picture ?? '';
  bool hasPicture() => _picture != null;

  // "FEWDS" field.
  String? _fewds;
  String get fewds => _fewds ?? '';
  bool hasFewds() => _fewds != null;

  // "branches" field.
  List<String>? _branches;
  List<String> get branches => _branches ?? const [];
  bool hasBranches() => _branches != null;

  // "meetingDetails" field.
  String? _meetingDetails;
  String get meetingDetails => _meetingDetails ?? '';
  bool hasMeetingDetails() => _meetingDetails != null;

  // "servingDetails" field.
  String? _servingDetails;
  String get servingDetails => _servingDetails ?? '';
  bool hasServingDetails() => _servingDetails != null;

  // "contactName" field.
  String? _contactName;
  String get contactName => _contactName ?? '';
  bool hasContactName() => _contactName != null;

  // "contactEmail" field.
  String? _contactEmail;
  String get contactEmail => _contactEmail ?? '';
  bool hasContactEmail() => _contactEmail != null;

  // "contactWhatsApp" field.
  String? _contactWhatsApp;
  String get contactWhatsApp => _contactWhatsApp ?? '';
  bool hasContactWhatsApp() => _contactWhatsApp != null;

  // "donations" field.
  bool? _donations;
  bool get donations => _donations ?? false;
  bool hasDonations() => _donations != null;

  // "volunteers" field.
  bool? _volunteers;
  bool get volunteers => _volunteers ?? false;
  bool hasVolunteers() => _volunteers != null;

  // "bankingDetails" field.
  String? _bankingDetails;
  String get bankingDetails => _bankingDetails ?? '';
  bool hasBankingDetails() => _bankingDetails != null;

  // "ministryName" field.
  String? _ministryName;
  String get ministryName => _ministryName ?? '';
  bool hasMinistryName() => _ministryName != null;

  // "forServing" field.
  bool? _forServing;
  bool get forServing => _forServing ?? false;
  bool hasForServing() => _forServing != null;

  void _initializeFields() {
    _name = snapshotData['name'] as String?;
    _description = snapshotData['description'] as String?;
    _picture = snapshotData['picture'] as String?;
    _fewds = snapshotData['FEWDS'] as String?;
    _branches = getDataList(snapshotData['branches']);
    _meetingDetails = snapshotData['meetingDetails'] as String?;
    _servingDetails = snapshotData['servingDetails'] as String?;
    _contactName = snapshotData['contactName'] as String?;
    _contactEmail = snapshotData['contactEmail'] as String?;
    _contactWhatsApp = snapshotData['contactWhatsApp'] as String?;
    _donations = snapshotData['donations'] as bool?;
    _volunteers = snapshotData['volunteers'] as bool?;
    _bankingDetails = snapshotData['bankingDetails'] as String?;
    _ministryName = snapshotData['ministryName'] as String?;
    _forServing = snapshotData['forServing'] as bool?;
  }

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('ministries');

  static Stream<MinistriesRecord> getDocument(DocumentReference ref) =>
      ref.snapshots().map((s) => MinistriesRecord.fromSnapshot(s));

  static Future<MinistriesRecord> getDocumentOnce(DocumentReference ref) =>
      ref.get().then((s) => MinistriesRecord.fromSnapshot(s));

  static MinistriesRecord fromSnapshot(DocumentSnapshot snapshot) =>
      MinistriesRecord._(
        snapshot.reference,
        mapFromFirestore(snapshot.data() as Map<String, dynamic>),
      );

  static MinistriesRecord getDocumentFromData(
    Map<String, dynamic> data,
    DocumentReference reference,
  ) =>
      MinistriesRecord._(reference, mapFromFirestore(data));

  @override
  String toString() =>
      'MinistriesRecord(reference: ${reference.path}, data: $snapshotData)';

  @override
  int get hashCode => reference.path.hashCode;

  @override
  bool operator ==(other) =>
      other is MinistriesRecord &&
      reference.path.hashCode == other.reference.path.hashCode;
}

Map<String, dynamic> createMinistriesRecordData({
  String? name,
  String? description,
  String? picture,
  String? fewds,
  String? meetingDetails,
  String? servingDetails,
  String? contactName,
  String? contactEmail,
  String? contactWhatsApp,
  bool? donations,
  bool? volunteers,
  String? bankingDetails,
  String? ministryName,
  bool? forServing,
}) {
  final firestoreData = mapToFirestore(
    <String, dynamic>{
      'name': name,
      'description': description,
      'picture': picture,
      'FEWDS': fewds,
      'meetingDetails': meetingDetails,
      'servingDetails': servingDetails,
      'contactName': contactName,
      'contactEmail': contactEmail,
      'contactWhatsApp': contactWhatsApp,
      'donations': donations,
      'volunteers': volunteers,
      'bankingDetails': bankingDetails,
      'ministryName': ministryName,
      'forServing': forServing,
    }.withoutNulls,
  );

  return firestoreData;
}

class MinistriesRecordDocumentEquality implements Equality<MinistriesRecord> {
  const MinistriesRecordDocumentEquality();

  @override
  bool equals(MinistriesRecord? e1, MinistriesRecord? e2) {
    const listEquality = ListEquality();
    return e1?.name == e2?.name &&
        e1?.description == e2?.description &&
        e1?.picture == e2?.picture &&
        e1?.fewds == e2?.fewds &&
        listEquality.equals(e1?.branches, e2?.branches) &&
        e1?.meetingDetails == e2?.meetingDetails &&
        e1?.servingDetails == e2?.servingDetails &&
        e1?.contactName == e2?.contactName &&
        e1?.contactEmail == e2?.contactEmail &&
        e1?.contactWhatsApp == e2?.contactWhatsApp &&
        e1?.donations == e2?.donations &&
        e1?.volunteers == e2?.volunteers &&
        e1?.bankingDetails == e2?.bankingDetails &&
        e1?.ministryName == e2?.ministryName &&
        e1?.forServing == e2?.forServing;
  }

  @override
  int hash(MinistriesRecord? e) => const ListEquality().hash([
        e?.name,
        e?.description,
        e?.picture,
        e?.fewds,
        e?.branches,
        e?.meetingDetails,
        e?.servingDetails,
        e?.contactName,
        e?.contactEmail,
        e?.contactWhatsApp,
        e?.donations,
        e?.volunteers,
        e?.bankingDetails,
        e?.ministryName,
        e?.forServing
      ]);

  @override
  bool isValidKey(Object? o) => o is MinistriesRecord;
}
