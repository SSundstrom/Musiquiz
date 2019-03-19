all: update install frontend

update:
	git reset --hard
	git pull

install:
	npm install

frontend:
	cd frontend && make
