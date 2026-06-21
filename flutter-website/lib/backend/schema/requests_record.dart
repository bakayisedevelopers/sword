import 'dart:async';

import 'package:collection/collection.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class RequestsRecord extends FirestoreRecord {
  RequestsRecord._(
    DocumentReference reference,
    Map<String, dynamic> data,
  ) : super(reference, data) {
    _initializeFields();
  }

  // "name" field.
  String? _name;
  String get name => _name ?? '';
  bool hasName() => _name != null;

  // "cell" field.
  String? _cell;
  String get cell => _cell ?? '';
  bool hasCell() => _cell != null;

  // "message" field.
  String? _message;
  String get message => _message ?? '';
  bool hasMessage() => _message != null;

  // "type" field.
  String? _type;
  String get type => _type ?? '';
  bool hasType() => _type != null;

  // "date" field.
  DateTime? _date;
  DateTime? get date => _date;
  bool hasDate() => _date != null;

  // "branch" field.
  String? _branch;
  String get branch => _branch ?? '';
  bool hasBranch() => _branch != null;

  // "surname" field.
  String? _surname;
  String get surname => _surname ?? '';
  bool hasSurname() => _surname != null;

  void _initializeFields() {
    _name = snapshotData['name'] as String?;
    _cell = snapshotData['cell'] as String?;
    _message = snapshotData['message'] as String?;
    _type = snapshotData['type'] as String?;
    _date = snapshotData['date'] as DateTime?;
    _branch = snapshotData['branch'] as String?;
    _surname = snapshotData['surname'] as String?;
  }

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('requests');

  static Stream<RequestsRecord> getDocument(DocumentReference ref) =>
      ref.snapshots().map((s) => RequestsRecord.fromSnapshot(s));

  static Future<RequestsRecord> getDocumentOnce(DocumentReference ref) =>
      ref.get().then((s) => RequestsRecord.fromSnapshot(s));

  static RequestsRecord fromSnapshot(DocumentSnapshot snapshot) =>
      RequestsRecord._(
        snapshot.reference,
        mapFromFirestore(snapshot.data() as Map<String, dynamic>),
      );

  static RequestsRecord getDocumentFromData(
    Map<String, dynamic> data,
    DocumentReference reference,
  ) =>
      RequestsRecord._(reference, mapFromFirestore(data));

  @override
  String toString() =>
      'RequestsRecord(reference: ${reference.path}, data: $snapshotData)';

  @override
  int get hashCode => reference.path.hashCode;

  @override
  bool operator ==(other) =>
      other is RequestsRecord &&
      reference.path.hashCode == other.reference.path.hashCode;
}

Map<String, dynamic> createRequestsRecordData({
  String? name,
  String? cell,
  String? message,
  String? type,
  DateTime? date,
  String? branch,
  String? surname,
}) {
  final firestoreData = mapToFirestore(
    <String, dynamic>{
      'name': name,
      'cell': cell,
      'message': message,
      'type': type,
      'date': date,
      'branch': branch,
      'surname': surname,
    }.withoutNulls,
  );

  return firestoreData;
}

class RequestsRecordDocumentEquality implements Equality<RequestsRecord> {
  const RequestsRecordDocumentEquality();

  @override
  bool equals(RequestsRecord? e1, RequestsRecord? e2) {
    return e1?.name == e2?.name &&
        e1?.cell == e2?.cell &&
        e1?.message == e2?.message &&
        e1?.type == e2?.type &&
        e1?.date == e2?.date &&
        e1?.branch == e2?.branch &&
        e1?.surname == e2?.surname;
  }

  @override
  int hash(RequestsRecord? e) => const ListEquality().hash(
      [e?.name, e?.cell, e?.message, e?.type, e?.date, e?.branch, e?.surname]);

  @override
  bool isValidKey(Object? o) => o is RequestsRecord;
}
