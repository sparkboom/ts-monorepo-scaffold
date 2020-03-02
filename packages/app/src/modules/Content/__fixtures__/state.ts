export const helpOptionResources = [
  {
    id: 'aa3add48-aa8a-456c-afa0-8037d93f822c',
    textKey: 'resource.help.a',
    url: 'http://www.example.com/documentation/1',
    context: 'HELP_OPTIONS',
  },
  {
    id: 'f042dbdb-bab4-4236-a6ce-38fa4297dc52',
    textKey: 'resource.help.b',
    url: 'http://www.example.com/documentation/1',
    context: 'HELP_OPTIONS',
  },
];

export const logTicketResource = {
  id: 'e6106c5d-e9bd-40da-9e7c-4850b6daf49b',
  textKey: 'resource.panel.logTicket',
  url: 'http://www.example.com/documentation/1',
  context: 'LOG_TICKET',
};

export const newTaskButtonResource = {
  id: '04c305d5-0058-4996-83c2-0bd78c6bc9e4',
  textKey: 'resource.panel.newTaskButton.label',
  url: 'http://www.example.com/documentation/1',
  context: 'TASKS__NEW_TASK_BUTTON',
};

export const errorPopoverResource = {
  id: '65d18af4-a8fa-4b2e-bcb2-968fe9b964db',
  textKey: 'resource.guides.readMore',
  url: 'http://www.example.com/documentation/1',
  context: 'ERROR_POPOVER__READ_MORE',
};

export const simpleState = {
  content: {
    resources: [...helpOptionResources, logTicketResource, newTaskButtonResource, newTaskButtonResource, errorPopoverResource],
  },
};

export const emptyState = {
  content: undefined,
};
