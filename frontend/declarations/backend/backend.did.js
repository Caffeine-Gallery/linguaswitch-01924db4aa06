export const idlFactory = ({ IDL }) => {
  const Translation = IDL.Record({
    'translated' : IDL.Text,
    'targetLanguage' : IDL.Text,
    'original' : IDL.Text,
  });
  return IDL.Service({
    'addTranslation' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [], []),
    'getTranslations' : IDL.Func([], [IDL.Vec(Translation)], ['query']),
    'init' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
