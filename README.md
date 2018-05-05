UR LOC



sudo npm install -g express-generator

sudo express v1

cd v1

sudo npm install

npm start






	2. Versuch (habe socket io nicht verfügbar gemacht bekkommen):

npm install --save express@4.15.2
npm install --save socket.io
npm install --save body-parser
npm install --save mongoose
npm install --save express-session
npm install --save connect-mongo
npm install --save bcrypt


Mongo DB starten
	Ein Terminal öffnen:
	mongod
	
Shell:
	Weieres Terminal Starten:
	mongo
	

Shell Befehle:

	--Alle DBs anzeigen
	show dbs
	
	--DB nutzen
	 use testForAuth
	
	--Get all collections
	show collections
	
	--Get all files from collection
	 db.users.find()
	
	--use filter predicates
	db.users.find({"email":"test@1.de"})
	
