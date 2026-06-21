import 'dart:async';

import 'package:collection/collection.dart';

import '/backend/schema/util/firestore_util.dart';
import '/backend/schema/util/schema_util.dart';
import '/backend/schema/enums/enums.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class SermonsRecord extends FirestoreRecord {
  SermonsRecord._(
    DocumentReference reference,
    Map<String, dynamic> data,
  ) : super(reference, data) {
    _initializeFields();
  }

  // "Title" field.
  String? _title;
  String get title => _title ?? '';
  bool hasTitle() => _title != null;

  // "date" field.
  DateTime? _date;
  DateTime? get date => _date;
  bool hasDate() => _date != null;

  // "description" field.
  String? _description;
  String get description => _description ?? '';
  bool hasDescription() => _description != null;

  // "video" field.
  String? _video;
  String get video => _video ?? '';
  bool hasVideo() => _video != null;

  // "videoLink" field.
  String? _videoLink;
  String get videoLink => _videoLink ?? '';
  bool hasVideoLink() => _videoLink != null;

  // "link" field.
  String? _link;
  String get link => _link ?? '';
  bool hasLink() => _link != null;

  // "preacher" field.
  String? _preacher;
  String get preacher => _preacher ?? '';
  bool hasPreacher() => _preacher != null;

  // "branchName" field.
  String? _branchName;
  String get branchName => _branchName ?? '';
  bool hasBranchName() => _branchName != null;

  // "branch" field.
  DocumentReference? _branch;
  DocumentReference? get branch => _branch;
  bool hasBranch() => _branch != null;

  void _initializeFields() {
    _title = snapshotData['Title'] as String?;
    _date = snapshotData['date'] as DateTime?;
    _description = snapshotData['description'] as String?;
    _video = snapshotData['video'] as String?;
    _videoLink = snapshotData['videoLink'] as String?;
    _link = snapshotData['link'] as String?;
    _preacher = snapshotData['preacher'] as String?;
    _branchName = snapshotData['branchName'] as String?;
    _branch = snapshotData['branch'] as DocumentReference?;
  }

  static CollectionReference get collection =>
      FirebaseFirestore.instance.collection('sermons');

  static Stream<SermonsRecord> getDocument(DocumentReference ref) =>
      ref.snapshots().map((s) => SermonsRecord.fromSnapshot(s));

  static Future<SermonsRecord> getDocumentOnce(DocumentReference ref) =>
      ref.get().then((s) => SermonsRecord.fromSnapshot(s));

  static SermonsRecord fromSnapshot(DocumentSnapshot snapshot) =>
      SermonsRecord._(
        snapshot.reference,
        mapFromFirestore(snapshot.data() as Map<String, dynamic>),
      );

  static SermonsRecord getDocumentFromData(
    Map<String, dynamic> data,
    DocumentReference reference,
  ) =>
      SermonsRecord._(reference, mapFromFirestore(data));

  @override
  String toString() =>
      'SermonsRecord(reference: ${reference.path}, data: $snapshotData)';

  @override
  int get hashCode => reference.path.hashCode;

  @override
  bool operator ==(other) =>
      other is SermonsRecord &&
      reference.path.hashCode == other.reference.path.hashCode;
}

Map<String, dynamic> createSermonsRecordData({
  String? title,
  DateTime? date,
  String? description,
  String? video,
  String? videoLink,
  String? link,
  String? preacher,
  String? branchName,
  DocumentReference? branch,
}) {
  final firestoreData = mapToFirestore(
    <String, dynamic>{
      'Title': title,
      'date': date,
      'description': description,
      'video': video,
      'videoLink': videoLink,
      'link': link,
      'preacher': preacher,
      'branchName': branchName,
      'branch': branch,
    }.withoutNulls,
  );

  return firestoreData;
}

class SermonsRecordDocumentEquality implements Equality<SermonsRecord> {
  const SermonsRecordDocumentEquality();

  @override
  bool equals(SermonsRecord? e1, SermonsRecord? e2) {
    return e1?.title == e2?.title &&
        e1?.date == e2?.date &&
        e1?.description == e2?.description &&
        e1?.video == e2?.video &&
        e1?.videoLink == e2?.videoLink &&
        e1?.link == e2?.link &&
        e1?.preacher == e2?.preacher &&
        e1?.branchName == e2?.branchName &&
        e1?.branch == e2?.branch;
  }

  @override
  int hash(SermonsRecord? e) => const ListEquality().hash([
        e?.title,
        e?.date,
        e?.description,
        e?.video,
        e?.videoLink,
        e?.link,
        e?.preacher,
        e?.branchName,
        e?.branch
      ]);

  @override
  bool isValidKey(Object? o) => o is SermonsRecord;
}
