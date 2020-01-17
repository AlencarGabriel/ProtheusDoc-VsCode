import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { SyntaxAdvpl } from '../../objects/SyntaxAdvpl';
import { ETypesDoc, ETypesAdvpl } from '../../interfaces/ISyntaxProtheusDoc';
import { ProtheusDoc, ELanguageSupport } from '../../objects/ProtheusDoc';
import { TransformAdvpl } from '../../objects/TransformAdvpl';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	// test('Sample test', () => {
	// 	assert.equal(-1, [1, 2, 3].indexOf(5));
	// 	assert.equal(-1, [1, 2, 3].indexOf(0));
	// });

	test('syntaxAdvpl', () => {
		let syntax = new SyntaxAdvpl();

		assert.equal(syntax.getIdentifier("fTest"), "/*/{Protheus.doc} fTest\n\n");
		assert.equal(syntax.getType(ETypesDoc.function), "@type function\n");
		assert.equal(syntax.getAuthor("Gabriel Alencar"), "@author Gabriel Alencar\n");
		assert.equal(syntax.getSince(new Date()), "@since " + new Date().toLocaleDateString() + "\n");
		assert.equal(syntax.getVersion("12.1.17"), "@version 12.1.17\n");
		assert.equal(syntax.getParams([{ paramName: "cName", paramType: ETypesAdvpl.C, paramDescription: "Descrição." }]), "@param cName, character, Descrição.\n");
		assert.equal(syntax.getReturn({ returnType: ETypesAdvpl.L, returnDescription: "Funcionou ou não." }), "@return logical, Funcionou ou não.\n");
		assert.equal(syntax.getFinisher(), "/*/");
	});

	test('TransformAdvpl', () => {
		let signature = "User Function fPdocTeste (cParam1, nParam2,xParam3) {";
		let transform = new TransformAdvpl(signature);

		assert.ok(transform);
		assert.equal(transform.getIdentifierName(), "fPdocTeste");
		assert.equal(transform.getType(), ETypesDoc.function);
	});

	test('ProtheusDOC', () => {
		let signature = "User Function fPdocTeste (cParam1, nParam2,xParam3) {";
		let protheusDoc = new ProtheusDoc(ELanguageSupport.advpl, signature);

		assert.ok(protheusDoc);
		assert.ok(protheusDoc.getProtheusDoc());
		// console.log(protheusDoc.getProtheusDoc());

	});

});
