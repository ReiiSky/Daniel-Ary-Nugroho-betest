import {Credential} from '../../source/domain/Credential';
import {Scope} from '../../source/domain/Scope';
import * as specs from '../../source/domain/specification';
import {ConnectionManagerBuilder} from '../../source/infrastructure/ConnectionManagerBuilder';
import {Kernel} from '../../source/infrastructure/Kernel';
import {RepositoriesRegistrator} from '../../source/infrastructure/RepositoriesRegistrator';
import {InMemoryBuilder} from '../../source/infrastructure/connection/InMemoryBuilder';
import {InMemoryGetCredentialByEmail} from '../../source/infrastructure/repositoryimpl/InMemoryGetCredentialByEmail';

describe('Use in-memory store in kernel repository', () => {
  const connectionManagerBuilder = new ConnectionManagerBuilder();
  connectionManagerBuilder.add(new InMemoryBuilder());

  const repositoryRegistrator = new RepositoriesRegistrator()
    .scope(Scope.Credential)
    .addSpecification(new InMemoryGetCredentialByEmail());

  const kernel = new Kernel(repositoryRegistrator, connectionManagerBuilder);
  const context = kernel.newContext();

  it('should be able to get credential from in-memory store by username.', async () => {
    const email = 'first.user123@gmail.com';
    const credRepository = context.repositories().Credential;
    const credential = await credRepository.getOne(new specs.GetByEmail(email));

    expect(credential.isNone).toBe(false);
    expect((credential.forceUnwrap() as Credential).isRegistered(email)).toBe(
      true
    );
  });

  afterAll(async () => {
    await context.close();
  });
});
