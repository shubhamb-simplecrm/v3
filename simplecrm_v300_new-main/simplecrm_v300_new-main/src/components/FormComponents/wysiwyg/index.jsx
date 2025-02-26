import React, { useState, useEffect } from 'react';
import useStyles from './styles';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import './style.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { APP_EDITOR_LOCALE } from '../../../constant';
import { Typography } from '@material-ui/core';

export default function Wysiwyg({ module, field, onChange, onBlur, errors={}, value, small = false, toolbar = {}, toolbarCustomButtons = [], toolbarHidden = false, height = '30vh', disabled = false }) {
	const classes = useStyles();
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	let iserror = errors[field.name] ? true : false;
	let isRequired = field.required === 'true' ? "*" : "";
	useEffect(() => {
		if (toHtml(editorState) === value) return;
		if (!value.id) {
			setEditorState(EditorState.push(
				editorState,
				ContentState.createFromBlockArray(
					htmlToDraft(value || ''),
				),
			)
			)
		}
	}, [value]);
	const onEditorStateChange = editorState => {
		setEditorState(editorState);
		const html = toHtml(editorState)
		onChange(html)
	};
	const onEditorStateBlur = (event, editorState) => {
		setEditorState(editorState);
		const html = toHtml(editorState)
		onBlur(html)

	};

	const toHtml = editorState => {
		return draftToHtml(convertToRaw(editorState.getCurrentContent())) // added
	}

	return (
		<>
			{module !== 'Emails' ? 
				<div 
				className={errors[field.name] && errors[field.name] !== 'ReadOnly' ? classes.errorTitle : classes.title}
				>
					{field.label ? 
						field.label.replace(/^./, field.label[0].toUpperCase())+isRequired
						: 
						field?.name.replace(/^./, field.name[0].toUpperCase())+isRequired}
				</div>
				: ""}
			<div className={errors[field.name] && errors[field.name] !== 'ReadOnly' ? classes.errorBox : null}>
			<Editor
				id={field.name}
				name={field.name}
				error={iserror}
				editorState={editorState}
				toolbarClassName={classes.wysiwygToolbox}
				wrapperClassName={classes.wysiwygWrapper}
				editorClassName={classes.wysiwygEditorBox}
				onEditorStateChange={onEditorStateChange}
				onBlur={onEditorStateBlur}
				toolbar={toolbar}
				toolbarCustomButtons={toolbarCustomButtons}
				toolbarHidden={toolbarHidden}
				editorStyle={{ height: height }}
				readOnly={errors[field.name] === 'ReadOnly' ? true : !!disabled}
				localization={{
					locale: APP_EDITOR_LOCALE,
				}}

			/>
			</div>
			<Typography variant="caption" style={{ color: "rgb(244,76,60)", paddingLeft: "13px" }}>{errors[field.name] && errors[field.name] !== 'ReadOnly' ? errors[field.name] : null}</Typography>
		</>
	);
}
