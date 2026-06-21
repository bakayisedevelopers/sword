import 'dart:async';

import 'package:collection/collection.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class SignUpsRecord extends FirestoreRecord {
  SignUpsRecord._(
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

  // "cell" field.
  String? _cell;
  String get cell => _cell ?? '';
  bool hasCell() => _cell != null;

  // "branch" field.
  String? _branch;
  String get branch => _branch ?? '';
  bool hasBranch() => _branch != null;

  // "message" field.
  String? _message;
  String get message => _message ?? '';
  bool hasMessage() => _message != null;

  // "type" field.
  List<String>? _type;
  List<String> get type => _type ?? const [];
  bool hasType() => _type != null;

  // "date" field.
  DateTime? _date;
  DateTime? get date => _date;
  bool hasDate() => _date != null;

  void _initializeFields() {
    _name = snapshotData['name'] as String?;
    _surname = snapshotData['surname'] as String?;
    _cell = snapshotData['cell'] as String?;
    _branch = snapshotData['branch'] as String?;
    _message = snapshotData['message'] as String?;
    _type = getDataList(snapshotData['type']);
    _date = snapshotData['date'] as DateTime?;
  }

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('signUps');

  static Stream<SignUpsRecord> getDocument(DocumentReference ref) =>
      ref.snapshots().map((s) => SignUpsRecord.fromSnapshot(s));

  static Future<SignUpsRecord> getDocumentOnce(DocumentReference ref) =>
      ref.get().then((s) => SignUpsRecord.fromSnapshot(s));

  static SignUpsRecord fromSnapshot(DocumentSnapshot snapshot) =>
      SignUpsRecord._(
        snapshot.reference,
        mapFromFirestore(snapshot.data() as Map<String, dynamic>),
      );

  static SignUpsRecord getDocumentFromData(
    Map<String, dynamic> data,
    DocumentReference reference,
  ) =>
      SignUpsRecord._(reference, mapFromFirestore(data));

  @override
  String toString() =>
      'SignUpsRecord(reference: ${reference.path}, data: $snapshotData)';

  @override
  int get hashCode => reference.path.hashCode;

  @override
  bool operator ==(other) =>
      other is SignUpsRecord &&
      reference.path.hashCode == other.reference.path.hashCode;
}

Map<String, dynamic> createSignUpsRecordData({
  String? name,
  String? surname,
  String? cell,
  String? branch,
  String? message,
  DateTime? date,
}) {
  final firestoreData = mapToFirestore(
    <String, dynamic>{
      'name': name,
      'surname': surname,
      'cell': cell,
      'branch': branch,
      'message': message,
      'date': date,
    }.withoutNulls,
  );

  return firestoreData;
}

class SignUpsRecordDocumentEquality implements Equality<SignUpsRecord> {
  const SignUpsRecordDocumentEquality();

  @override
  bool equals(SignUpsRecord? e1, SignUpsRecord? e2) {
    const listEquality = ListEquality();
    return e1?.name == e2?.name &&
        e1?.surname == e2?.surname &&
        e1?.cell == e2?.cell &&
        e1?.branch == e2?.branch &&
        e1?.message == e2?.message &&
        listEquality.equals(e1?.type, e2?.type) &&
        e1?.date == e2?.date;
  }

  @override
  int hash(SignUpsRecord? e) => const ListEquality().hash(
      [e?.name, e?.surname, e?.cell, e?.branch, e?.message, e?.type, e?.date]);

  @override
  bool isValidKey(Object? o) => o is SignUpsRecord;
}
