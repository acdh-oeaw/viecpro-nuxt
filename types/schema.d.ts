interface BaseEntity {
	ampel: string;
	alternativenames: Array<string>;
	id: string;
	object_id: number;
	start_date: string;
	start_date_int: number;
	end_date: string;
	end_date_int: number;
	start: string;
	name: string;
	end: string;
	kind: string;
	model: string;
	labels: Array<Label>;
}

export type AnyEntity = Court | Event | Institution | Person | Place;
export type AnyDetail = CourtDetail | InstitutionDetail | PersonDetail | PlaceDetail;

export interface Court extends BaseEntity {
	owner: Array<CourtOwner>;
	main_owner: CourtOwner;
}

export interface CourtOwner {
	object_id: number;
	name: string;
	end_date: string;
	start_date: string;
	relation_type: string;
	model: string;
}

export interface Reference {
	start_page: string;
	end_page: string;
	folio: string;
	model: string;
	title: string;
	shortTitle: string;
	kind: string;
	related_doc: ReferenceRelatedDoc;
	id: string;
	tag: string;
}
export interface ReferenceRelatedDoc {
	object_id: string;
	name: string;
	model: string;
	id: string;
}

export interface Place extends BaseEntity {
	lat: string;
	long: string;
}

export interface Person extends BaseEntity {
	first_name: string;
	fullname: string;
	gender: string;
	titles: Array<PersonTitle>;
	functions: Array<string>;
	institutions: Array<string>;
}

export interface Label {
	object_id: string;
	name: string;
	model: Array<string>;
	label_type: Array<string>;
	label_hierarchy: Array<string>;
	start_date: Array<string>;
	end_date: Array<string>;
}

export interface Institution extends BaseEntity {}

export interface Event extends BaseEntity {}

export interface Relation {
	id: string;
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
	relation_type_id: number;
	relation_type: string;
	relation_type_hierarchy: string;
	relation_reverse: string;
}
export interface BasicLabel {
	object_id: string;
	name: string;
	model: string;
}

export interface PersonTitle extends BasicLabel {}
export interface RelationSourceTarget extends BasicLabel {}

export interface DetailLabel {
	name: string;
	start_date: string;
	end_date: string;
}

export interface DetailRelation extends DetailLabel {
	relation_type: string;
	target: RelationSourceTarget;
}

export interface PersonDetail extends GenericDetail {
	had_courts: Array<RelationSourceTarget>;
	place_of_birth: RelationSourceTarget;
	place_of_death: RelationSourceTarget;
	confession: Array<string>;
	first_marriage: string;
	married_names: Array<DetailLabel>;
	duplicates: Array<DetailRelation>;
	alternative_first_names: Array<string>;
	alternative_last_names: Array<string>;
	alternative_birth_dates: Array<string>;
	alternative_death_dates: Array<string>;
	honorary_titles: Array<DetailLabel>;
	academic_titles: Array<DetailLabel>;
	sources: Array<object>;
	court_functions: Array<DetailRelation>;
	person_relations_court: Array<DetailRelation>;
	other_relations_court: Array<DetailLabel>;
	marriages_and_family_relations: Array<DetailRelation>;
	relations_to_church_and_orders: Array<DetailRelation>;
	non_court_functions: Array<DetailRelation>;
	related_places: Array<DetailRelation>;
	allowance: Array<string>;
	notes: string;
	sameAs: Array<string>;
}

export interface GenericRelation {
	relation_type: string;
	target: RelationSourceTarget;
	end_date: string;
	start_date: string;
}

export interface GenericDetail {
	model: string;
	object_id: string;
	sameAs: Array<string>;
	ampel: "green" | "red" | "yellow";
}

export interface InstitutionDetail extends GenericDetail {
	resolution: string;
	category: string;
	alternative_names: Array<DetailLabel>;
	sources: Array<{
		bibtex: {
			id: Array<string>;
			URL: Array<string>;
			type: Array<string>;
			title: Array<string>;
			shortTitle: Array<string>;
			issued: {
				season: Array<string>;
				"date-parts": Array<number>;
			};
		};
		folio: Array<string>;
	}>;
	personnel: Array<GenericRelation>;
	locations: Array<GenericRelation>;
	hierarchy: Array<GenericRelation>;
}

export interface PlaceDetail extends GenericDetail {
	alternative_names: Array<string>;
	person_relations: Array<GenericRelation>;
	place_relations: Array<GenericRelation>;
	institution_relations: Array<GenericRelation>;
}
export interface CourtDetail extends GenericDetail {
	resolution: string;
	category: string;
	alternative_names: Array<DetailLabel>;
	owners: Array<GenericRelation>;
	sources: Array<object>;
	personnel: Array<GenericRelation>;
	locations: Array<GenericRelation>;
	hierarchy: Array<GenericRelation>;
}
