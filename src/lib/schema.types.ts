interface BaseEntity {
	object_id: number;
	start_date: string;
	end_date: string;
	start: string;
	name?: string;
	end: string;
	kind: string;
	model: string;
	labels?: Array<Label>;
}

export type AnyEntity = Court | Event | Institution | Person | Place | Reference | Relation;

export interface Court extends BaseEntity {
	owner?: Array<CourtOwner>;
	main_owner?: CourtOwner;
}

export interface CourtOwner {
	object_id?: number;
	name?: string;
	end_date?: string;
	start_date?: string;
	relation_type?: string;
	model?: string;
}

export interface Reference {
	start_page?: string;
	end_page?: string;
	folio?: string;
	model: string;
	title?: string;
	shortTitle?: string;
	kind?: string;
	related_doc?: ReferenceRelatedDoc;
}
export interface ReferenceRelatedDoc {
	object_id?: string;
	name?: string;
	model?: string;
	id?: string;
}

export interface Place extends BaseEntity {
	lat?: string;
	long?: string;
}

export interface Person extends BaseEntity {
	first_name?: string;
	fullname: string;
	gender?: string;
	titles?: Array<PersonTitle>;
}

export interface Label {
	object_id?: string;
	name?: string;
	model?: Array<string>;
	label_type?: Array<string>;
	label_hierarchy?: Array<string>;
	start_date?: Array<string>;
	end_date?: Array<string>;
}

export interface PersonTitle {
	object_id?: Array<string>;
	name?: Array<string>;
	model?: Array<string>;
}

export interface Institution extends BaseEntity {}

export interface Event extends BaseEntity {}

export interface Relation {
	object_id: number;
	start_date: string;
	end_date: string;
	start: string;
	end: string;
	model: string;
	source: RelationSourceTarget;
	source_kind: string;
	target: RelationSourceTarget;
	target_kind: string;
	relation_type_id?: number;
	relation_type: string;
	relation_type_hierarchy?: string;
	relation_reverse?: string;
}

export interface RelationSourceTarget {
	object_id?: string;
	name?: string;
	model?: string;
}
