CREATE TABLE QUIZ (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    image_id TEXT DEFAULT NULL,
    expiration_date TIMESTAMP NOT NULL,
);

CREATE TABLE OPTION (
    id BIGSERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    question_id BIGINT NOT NULL,
    CONSTRAINT fk_option_question_id
    FOREIGN KEY (question_id) REFERENCES Question(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE QUESTION (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    image_id TEXT DEFAULT NULL,
    quiz_id BIGINT NOT NULL,
    CONSTRAINT fk_question_quiz_id
    FOREIGN KEY (quiz_id) REFERENCES Quiz(id) ON DELETE CASCADE ON UPDATE CASCADE
);
