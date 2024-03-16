CREATE TABLE QUIZ (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    image_id TEXT DEFAULT NULL,
    expiration_date TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE QUESTION (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    image_id TEXT DEFAULT NULL,
    quiz_id BIGINT NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_question_quiz_id
    FOREIGN KEY (quiz_id) REFERENCES Quiz(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE OPTION (
    id BIGSERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    question_id BIGINT NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_option_question_id
    FOREIGN KEY (question_id) REFERENCES Question(id) ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE OR REPLACE FUNCTION set_created_at_and_updated_at() RETURNS TRIGGER AS $set_created_at_and_updated_at$
BEGIN
    NEW.created_at = NOW();
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$set_created_at_and_updated_at$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $set_updated_at$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$set_updated_at$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_expiration_date() RETURNS TRIGGER AS $set_expiration_date$
BEGIN
    NEW.expiration_date = NOW() + INTERVAL '2 day';
    RETURN NEW;
END;
$set_expiration_date$ LANGUAGE plpgsql;

CREATE TRIGGER set_created_at_and_updated_at_on_quiz BEFORE INSERT ON QUIZ FOR EACH ROW EXECUTE FUNCTION set_created_at_and_updated_at();
CREATE TRIGGER set_created_at_and_updated_at_on_question BEFORE INSERT ON QUESTION FOR EACH ROW EXECUTE FUNCTION set_created_at_and_updated_at();
CREATE TRIGGER set_created_at_and_updated_at_on_option BEFORE INSERT ON OPTION FOR EACH ROW EXECUTE FUNCTION set_created_at_and_updated_at();

CREATE TRIGGER set_updated_at_on_quiz BEFORE UPDATE ON QUIZ FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_on_question BEFORE UPDATE ON QUESTION FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_on_option BEFORE UPDATE ON OPTION FOR EACH ROW EXECUTE FUNCTION set_updated_at();


CREATE TRIGGER set_expiration_date_on_quiz BEFORE INSERT ON QUIZ FOR EACH ROW EXECUTE FUNCTION set_expiration_date();
