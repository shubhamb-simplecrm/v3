const defaultEmailSettings = {
    gmail:{
        
        inbound:{            
            server_url:'imap.gmail.com',
            ssl:true,
            protocol:'imap',
            port:'993',
            trashFolder:'[Gmail]/Trash',
            sentFolder:'[Gmail]/Sent',
            mailbox:'INBOX',
            personal:true
        },
        outbound:{
            mail_smtpserver:'smtp.gmail.com',
            mail_smtpauth_req:true,
            mail_smtpssl:'2',
            mail_smtpport:'587'
        }
        
    },
    yahoo:{
        inbound:{
            server_url:'imap.mail.yahoo.com',
            ssl:true,
            protocol:'imap',
            port:'465',
            trashFolder:'',
            sentFolder:'',
            mailbox:'INBOX',
            personal:true
        },
        outbound:{
            domain:'yahoo.com',
            mail_smtpserver:'smtp-mail.outlook.com',
            mail_smtpauth_req:true,
            mail_smtpssl:'2',
            mail_smtpport:'587'
        }
    },
    exchange:{
        inbound:{
            server_url:'outlook.office365.com',
            ssl:true,
            protocol:'imap',
            port:'993',
            trashFolder:'',
            sentFolder:'',
            mailbox:'INBOX',
            personal:true
        },
        outbound:{
            mail_smtpserver:'smtp.office365.com',
            mail_smtpauth_req:true,
            mail_smtpssl:'2',
            mail_smtpport:'587'
        }
    },
    other:{
        inbound:{
            server_url:'',
            ssl:false,
            protocol:'',
            port:'',
            mailbox:'INBOX',
            trashFolder:'',
            sentFolder:'',
            personal:true
        },
        outbound:{
            mail_smtpserver:'',
            mail_smtpauth_req:false,
            mail_smtpssl:'',
            mail_smtpport:''
        }
    }
}
const CreateViewInbound = {
    data:[
        {
            type:'tab',
            label:'IMAP Setting',
            attributes:[
                [
                    {
                        field_key: 'email_user',
                        name: 'email_user',
                        label: 'User Name',
                        type: 'varchar',
                        required: 'true',
                        comment: 'User Name',
                        len: 150,
                        value:""
                    },
                    {
                        field_key: 'email_password',
                        name: 'email_password',
                        label: 'Password',
                        type: 'password',
                        required: 'true',
                        comment: 'Password',
                        len: 150,
                        value:"",
                        showVisibilityIcon: false,
                    },
                ],
                [
                    {
                        field_key: 'ie_name',
                        name: 'ie_name',
                        label: 'Mail Account Name',
                        type: 'varchar',
                        required: 'true',
                        comment: 'Mail Account Name',
                        len: 150,
                        value:""
                    },
                    {
                        field_key: 'server_url',
                        name: 'server_url',
                        label: 'Mail Server Address',
                        type: 'varchar',
                        required: 'true',
                        comment: 'Mail Server Address',
                        len: 150,
                        value:""
                    }
                ],
                [
                    {
                        field_key: 'protocol',
                        name: 'protocol',
                        label: 'Mail Server Protocol',
                        type: 'enum',
                        required: 'true',
                        comment: 'Mail Server Protocol',
                        options:{
                            "":"",
                            "imap":"IMAP",
                            "pop3":"POP3"
                        },
                        len: 150,
                        value:""
                    },
                    {
                        field_key: 'ssl',
                        name: 'ssl',
                        label: 'Use SSL',
                        type: 'bool',
                        // required: 'true',
                        comment: 'If your mail server supports secure socket connections, enabling this will force SSL connections when importing email.',
                        len: 150,
                        value:""
                    }
                ],
                [
                    {
                        field_key: 'port',
                        name: 'port',
                        label: 'Mail Server Port',
                        type: 'varchar',
                        required: 'true',
                        comment: 'Mail Server Port',
                        len: 150,
                        value:""
                    },
                    {
                        field_key: 'ie_status',
                        name: 'ie_status',
                        label: 'Active',
                        type: 'bool',
                        required: 'false',
                        comment: 'Active',
                        len: 150,
                        value:true
                    },
                ],
                [
                    
                    {
                        field_key: 'is_default',
                        name: 'is_default',
                        label: 'Default',
                        type: 'bool',
                        required: 'false',
                        comment: 'Default',
                        len: 150,
                        value:""
                    },
                ]
            ]           
        },
        {
            type:'tab',
            label:'Outgoing Email',
            attributes:[
                [
                    {
                        field_key: 'reply_to_addr',
                        name: 'reply_to_addr',
                        label: 'Reply to Address',
                        type: 'varchar',
                        required: 'false',
                        comment: 'Reply to Address',
                        len: 150,
                        value:""
                    },
                    {
                        field_key: 'outbound_email',
                        name: 'outbound_email',
                        label: 'Outgoing SMTP Mail Server',
                        type: 'enum',
                        options:{'':'--select--'},
                        required: 'true',
                        comment: 'Outgoing SMTP Mail Server',
                        len: 150,
                        value:""
                    },
                ],
            ]
        },
     
    ]
}

const CreateViewOutbound = {
    data:[
        {
            type:'tab',
            label:'Outbound Email Setting',
            attributes:[
                [
                    {
                        field_key: 'mail_name',
                        name: 'mail_name',
                        label: 'Name',
                        type: 'varchar',
                        required: 'true',
                        comment: 'Name',
                        len: 150
                    },
                    {
                        field_key: 'smtp_from_name',
                        name: 'smtp_from_name',
                        label: '"From" Name:',
                        type: 'varchar',
                        required: 'true',
                        comment: 'From Name',
                        len: 150
                    },
                ],
                [
                    {
                        field_key: 'smtp_from_addr',
                        name: 'smtp_from_addr',
                        label: '"From" Address:',
                        type: 'varchar',
                        required: 'true',
                        comment: 'From Address',
                        len: 150
                    },
                    {
                        field_key: 'mail_smtpserver',
                        name: 'mail_smtpserver',
                        label: 'SMTP Server:',
                        type: 'varchar',
                        required: 'true',
                        comment: 'SMTP Server',
                        len: 150
                    }
                ],
                [
                    {
                        field_key: 'mail_smtpport',
                        name: 'mail_smtpport',
                        label: 'SMTP Port:',
                        type: 'varchar',
                        required: 'true',
                        comment: 'SMTP Port',
                        len: 150
                    },
                    {
                        field_key: 'mail_smtpssl',
                        name: 'mail_smtpssl',
                        label: 'Enable SMTP over SSL or TLS?',
                        type: 'enum',
                        required: false,
                        comment: 'Enable SMTP over SSL or TLS?',
                        options:{
                            "":"",
                            "1":"SSL",
                            "2":"TLS"
                        },
                        len: 150
                    }
                ],
                [
                    {
                        field_key: 'mail_smtpauth_req',
                        name: 'mail_smtpauth_req',
                        label: 'Use SMTP',
                        type: 'bool',
                        required: false,
                        comment: 'Use SMTP',
                        len: 150,
                        value:true
                    },
                ],
                [
                    {
                        field_key: 'mail_smtpuser',
                        name: 'mail_smtpuser',
                        label: 'Email Address:',
                        type: 'varchar',
                        required: 'true',
                        comment: 'SMTP Username:',
                        len: 150
                    },
                    {
                        field_key: 'mail_smtppass',
                        name: 'mail_smtppass',
                        label: 'Email Password: ',
                        type: 'password',
                        required: 'true',
                        comment: 'SMTP Password: ',
                        len: 150,
                        showVisibilityIcon: false,
                    }
                ]
            ]           
        }
    ]
}
const CreateViewSignature = {
    data:[
        {
            //type:'tab',
            label:'Signature',
            attributes:[
                [
                    {
                        field_key: 'name',
                        name: 'name',
                        label: 'Name',
                        type: 'varchar',
                        required: 'true',
                        comment: 'Name',
                        len: 150
                    }
                ]
            ]           
        }
    ]
}
const EditViewMeta = {inbound:CreateViewInbound, outbound:CreateViewOutbound, signature:CreateViewSignature};

export {EditViewMeta,defaultEmailSettings};
