# MindHive

Inspo: I'm a visual learner and like to see how things are related. Couldn't 
find a mind mapping tool I liked so made one instead.
 
Tech stack: AWS Amplify, React, Graphql(DynamoDB/AppSync)

https://d1v0z5tmm8db3h.cloudfront.net

## TODO
- Focus Update in place
- ~~Drop down for colour~~
- ~~Text box for Topic/description~~
- ~~Add TAG model to schema~~
- Add TAG on UPDATE and ADD Topic 
- Filter on tag, for Vista view, with + filter on things
- Multiple TAGs on TOPIC
- Limit tags to 1 word lower case
- Update link, will be an addition to add
- Delete topic, to delete the links too make sure there's a are you sure
- Delete links
- Upload Image for topic
- Cache large search
- Search
- Use for ipad
- Study mode/Edit mode
- Click on topic, redirects instead of new page
- First time users have a topic and a link
- Fix up cognito so username doesn't have to Case Sensitive
- Focus view, when adding a topic make it so the link is automatic to topic
- Add more colours and have it shown at the dropdown
- ~~Change tab icon~~
- Cap characters for Description in Topic
- Put my details at the bottom

## Use
- `npm  start` will run on localhost:3000 (though will probs need to create your own amplify project :sweat_smile:)
- `amplify publsih` update changes for running website

## Lessons Learnt 

- When publishing with cloudfront and S3 make sure to clear the cloudfront cache if you keep getting `Unauthorised`.
It takes a couple of hours to get the cloudfront site working. Don't despair.
- Graphql queries make sure you add limits for listModel

### Ref

#### Links

- graph js lib:https://gojs.net/latest/index.html
- graphql schemas: https://aws-amplify.github.io/docs/cli-toolchain/graphql
- React ui: https://react.semantic-ui.com
- Amplify Auth: https://github.com/mwarger/amplify-auth-examples

#### Colours
- 5E36FF, bluepurple 

#### Icons

- logo: https://iconmonstr.com/idea-12-png/ 
