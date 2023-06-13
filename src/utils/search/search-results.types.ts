// FIXME: `model` should be english, plural, lowercase
// FIXME: some `object_id` fields are string, some are number
// FIXME: clarify `object_id` vs. `objectID` vs `id`
// TODO: enums for `kind` fields?

interface Label {
	model: "Label";
	object_id: string;

	name: string;

	end_date: string;
	start_date: string;

	label_hierarchy: string;
	label_type: string;
}

interface Owner {
	model: "Person";
	object_id: number;

	name: string;

	end_date: string;
	start_date: string;

	relation_type: string;
}

interface PersonTitle {
	model: "Title";
	object_id: string;

	name: string;
}

interface EntityBase {
	model: string;
	id: string;
	object_id: number;

	name: string;
	labels: Array<Label>;

	end: string;
	end_date: string;
	start: string;
	start_date: string;
}

export interface Court extends EntityBase {
	model: "Hofstaat";

	kind: string;
	main_owner: Owner;
	owner: Array<Owner>;
}

export interface Event extends EntityBase {
	model: "Event";

	kind: string;
}

export interface Institution extends EntityBase {
	model: "Institution";

	kind: string;
}

export interface Person extends EntityBase {
	model: "Person";

	first_name: string;
	fullname: string;
	gender: string;
	titles: Array<PersonTitle>;
}

export interface Place extends EntityBase {
	model: "Place";

	kind: string;
	lat: string;
	long: string;
}

export type Entity = Court | Event | Institution | Person | Place;

export type EntityModel = Entity["model"];

//

export interface Reference {
	model: "Reference";
	// object_id: number;
	id: string;

	title: string;
	shortTitle: string;
	folio: string;
	end_page: string;
	start_page: string;

	kind: string;
	related_doc: {
		model: "Person"; // FIXME: check if this is always the case
		id: string;
		object_id: string;

		name: string;
	};
}

//

interface RelationBase {
	model: string;
	id: string;
	object_id: number;

	end: string;
	end_date: string;
	start: string;
	start_date: string;

	source: {
		model: RelationModel;
		object_id: string;

		name: string;
	};
	source_kind: string;
	target: {
		model: RelationModel;
		object_id: string;

		name: string;
	};
	target_kind: string;
	relation_type: string;
	relation_type_id: number;
	relation_type_hierarchy: string;
	relation_reverse: string;
}

export interface PersonPersonRelation extends RelationBase {
	model: "PersonPerson";
}

export interface PersonInstitutionRelation extends RelationBase {
	model: "PersonInstitution";
}

export interface PersonPlaceRelation extends RelationBase {
	model: "PersonPlace";
}

export interface PersonEventRelation extends RelationBase {
	model: "PersonEvent";
}

export interface InstitutionInstitutionRelation extends RelationBase {
	model: "InstitutionInstitution";
}

export interface InstitutionPlaceRelation extends RelationBase {
	model: "InstitutionPlace";
}

export interface InstitutionEventRelation extends RelationBase {
	model: "InstitutionEvent";
}

export interface PlacePlaceRelation extends RelationBase {
	model: "PlacePlace";
}

export interface PlaceEventRelation extends RelationBase {
	model: "PlaceEvent";
}

export interface EventEventRelation extends RelationBase {
	model: "EventEvent";
}

export type Relation =
	| EventEventRelation
	| InstitutionEventRelation
	| InstitutionInstitutionRelation
	| InstitutionPlaceRelation
	| PersonEventRelation
	| PersonInstitutionRelation
	| PersonPersonRelation
	| PersonPlaceRelation
	| PlaceEventRelation
	| PlacePlaceRelation;

export type RelationModel = Relation["model"];
